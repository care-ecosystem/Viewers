// extensions/care-image-actions/getCommandsModule.js
export default function getCommandsModule({ servicesManager }) {
  const actions = {
    copyViewportImage: async () => {
      const {
        viewportGridService,
        cornerstoneViewportService,
        uiNotificationService,
      } = servicesManager.services; // ← read fresh, at click time

      console.log('[care-image-actions] services:', {
        viewportGridService,
        cornerstoneViewportService,
        uiNotificationService,
      });

      if (!cornerstoneViewportService) {
        console.error('[care-image-actions] cornerstoneViewportService not registered');
        return;
      }

      const { activeViewportId } = viewportGridService.getState();
      const viewportInfo = cornerstoneViewportService.getViewportInfo(activeViewportId);

      if (!viewportInfo) {
        console.warn('[care-image-actions] No active viewport info found');
        return;
      }

      const canvas = viewportInfo.getElement()?.querySelector('canvas');
      if (!canvas) {
        console.warn('[care-image-actions] No canvas found in viewport element');
        return;
      }

      canvas.toBlob(async blob => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          uiNotificationService.show({ title: 'Copied', message: 'Image copied to clipboard' });
        } catch (err) {
          console.error('[care-image-actions] clipboard write failed:', err);
          uiNotificationService.show({ title: 'Copy failed', message: err.message, type: 'error' });
        }
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
