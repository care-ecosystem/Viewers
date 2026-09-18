// extensions/care-image-actions/getCommandsModule.js
export default function getCommandsModule({ servicesManager }) {
  const actions = {
    copyViewportImage: async () => {
      const { viewportGridService, cornerstoneViewportService } = servicesManager.services;

      if (!cornerstoneViewportService) {
        console.error('[care-image-actions] cornerstoneViewportService not registered');
        return;
      }

      const { activeViewportId } = viewportGridService.getState();
      const viewportInfo = cornerstoneViewportService.getViewportInfo(activeViewportId);

      if (!viewportInfo) {
        console.warn('[care-image-actions] No active viewport found');
        return;
      }

      const canvas = viewportInfo.getElement()?.querySelector('canvas');
      if (!canvas) {
        console.warn('[care-image-actions] No canvas found in viewport element');
        return;
      }

      canvas.toBlob(blob => {
        if (!blob) {
          console.warn('[care-image-actions] canvas.toBlob() returned null');
          return;
        }

        const targetOrigin = document.referrer
          ? new URL(document.referrer).origin
          : window.location.origin;

        window.parent.postMessage(
          { source: 'ohif-viewer', type: 'COPY_VIEWPORT_IMAGE', blob },
          targetOrigin
        );
      }, 'image/png');
    },
  };

  return {
    actions,
    definitions: {
      copyViewportImage: { commandFn: actions.copyViewportImage },
    },
    defaultContext: 'CORNERSTONE',
  };
}
