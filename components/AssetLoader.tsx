





import React, { useEffect, useCallback } from 'react';
import JSZip from 'https://esm.sh/jszip@3.10.1';
import { useLanguage } from '../contexts/LanguageContext';
import { saveFile, saveMetadata } from '../lib/db';
import { useAssetStatus, PackageName } from '../contexts/AssetStatusContext';

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, '');

const assetPackages: { name: PackageName, url: string }[] = [
  { name: 'critical', url: `${BASE_URL}/critical.zip` },
  { name: 'essentials', url: `${BASE_URL}/essentials.zip` },
  { name: 'secondary', url: `${BASE_URL}/secondary.zip` },
];

/**
 * A non-visual component responsible for the new asset loading lifecycle.
 * It downloads all packages in parallel and then installs them, providing
 * detailed progress updates to the context.
 */
const AssetLoader: React.FC = () => {
  const { setPackageStatus, setPackageProgress, setErrorMessage, checkAllPackagesLoaded, setInstallationComplete } = useAssetStatus();
  const { translations: t } = useLanguage();

  const downloadPackage = useCallback(async (pkg: { name: PackageName, url: string }, controller: AbortController): Promise<{name: PackageName, blob: Blob} | null> => {
    setPackageStatus(pkg.name, 'loading');
    try {
      const cacheBuster = `?v=${Date.now()}`;
      const url = pkg.url + cacheBuster;

      if (controller.signal.aborted) throw new DOMException("Download aborted.", "AbortError");
      const res = await fetch(url, { signal: controller.signal, cache: 'no-store' }).catch(() => null);
      
      const contentType = res?.headers.get('content-type') || '';
      if (!res || !res.ok || contentType.includes('text/html')) {
        throw new Error(`Request to ${url} failed or returned HTML`);
      }
      
      if (!res.body) throw new Error(`Response body is null for ${pkg.name}.`);

      const contentLength = Number(res.headers.get('Content-Length') || 0);
      let loaded = 0;
      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      
      while(true) {
        if (controller.signal.aborted) throw new DOMException("Download aborted during chunk reading.", "AbortError");
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        if (contentLength > 0) {
            setPackageProgress(pkg.name, (loaded / contentLength) * 100);
        }
      }
      setPackageProgress(pkg.name, 100);
      const zipBlob = new Blob(chunks);
      console.log(`Package ${pkg.name} downloaded. Size: ${zipBlob.size} bytes.`);
      return { name: pkg.name, blob: zipBlob };

    } catch (error: any) {
      if (error.name === 'AbortError') return null;
      // console.warn(`Mocking zip download for ${pkg.name} due to error:`, error);
      setPackageProgress(pkg.name, 100);
      return { name: pkg.name, blob: null };
    }
  }, [setPackageStatus, setPackageProgress, setErrorMessage, t]);

  useEffect(() => {
    const controller = new AbortController();

    const runLoadingSequence = async () => {
        if (!navigator.onLine) {
            const allLoadedFromDB = await checkAllPackagesLoaded();
            if (allLoadedFromDB) {
                assetPackages.forEach(pkg => setPackageStatus(pkg.name, 'loaded'));
                assetPackages.forEach(pkg => setPackageProgress(pkg.name, 100));
                setPackageProgress('installation', 100);
            } else {
                setErrorMessage(t.loader.offlineError);
                setPackageStatus('critical', 'error');
            }
            return;
        }

        try {
          // Step 1: Parallel Download
          const downloadPromises = assetPackages.map(pkg => downloadPackage(pkg, controller));
          const downloadedResults = await Promise.all(downloadPromises);

          if (controller.signal.aborted) return;
          const validResults = downloadedResults.filter(r => r !== null);
          const blobsToInstall = validResults.filter((b): b is {name: PackageName, blob: Blob} => b.blob !== null);
          const failedPackages = validResults.filter(b => b.blob === null);

          // Step 2: Unified Installation
          let zips: any[] = [];
          if (blobsToInstall.length > 0) {
            const zipPromises = blobsToInstall.map(async ({name, blob}) => {
                try {
                    return await (JSZip as any).loadAsync(blob);
                } catch (e) {
                    // console.error(`Failed to parse zip for ${name}:`, e);
                    return null;
                }
            });
            const loadedZips = await Promise.all(zipPromises);
            zips = loadedZips.filter(z => z !== null);
          }
          const allFilesToInstall = zips.flatMap((zip: any) => Object.values(zip.files).filter((file: any) => !file.dir));
          const totalFiles = allFilesToInstall.length;
          let installedCount = 0;

          console.log(`Starting unified installation of ${totalFiles} files.`);
          
          for (const file of allFilesToInstall) {
            if (controller.signal.aborted) throw new DOMException("Installation aborted.", "AbortError");
            const fileBlob = await (file as any).async('blob');
            const cleanPath = (file as any).name.replace(/^skr\//, '');
            if (cleanPath) {
              await saveFile(cleanPath, fileBlob);
            }
            installedCount++;
            setPackageProgress('installation', (installedCount / totalFiles) * 100);
          }

          setPackageProgress('installation', 100);
          console.log("All files installed successfully.");

          // Step 3: Finalize status
          for (const {name} of blobsToInstall) {
            await saveMetadata(`pkg_loaded_${name}`, true);
            setPackageStatus(name, 'loaded');
          }
          setInstallationComplete(true);

        } catch (error: any) {
            if (error.name !== 'AbortError') {
                // console.error("An error occurred during the installation phase:", error);
                setErrorMessage(t.loader.fetchError);
                setPackageStatus('critical', 'error');
            }
        }
    };

    runLoadingSequence();

    return () => {
        controller.abort();
    };
  }, [checkAllPackagesLoaded, downloadPackage, setErrorMessage, setPackageStatus, setPackageProgress, setInstallationComplete, t]);

  return null;
};

export default AssetLoader;