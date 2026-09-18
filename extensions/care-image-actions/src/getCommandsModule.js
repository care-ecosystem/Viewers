// extensions/care-image-actions/getCommandsModule.js
export default function getCommandsModule({ servicesManager }) {
  const { viewportGridService, cornerstoneViewportService, uiNotificationService } =
    servicesManager.services;

  const actions = {
    copyViewportImage: async () => {
      console.log('[care-image-actions] copyViewportImage triggered');

      const gridState = viewportGridService.getState();
      console.log('[care-image-actions] viewportGridService.getState():', gridState);

      const { activeViewportId } = gridState;
      console.log('[care-image-actions] activeViewportId:', activeViewportId);

      const viewportInfo = cornerstoneViewportService.getViewportInfo(activeViewportId);
      console.log('[care-image-actions] viewportInfo:', viewportInfo);

      if (!viewportInfo) {
        console.warn('[care-image-actions] No viewportInfo found for active viewport — aborting');
        return;
      }

      const element = viewportInfo.getElement();
      console.log('[care-image-actions] viewport element:', element);

      const canvas = element?.querySelector('canvas');
      console.log('[care-image-actions] canvas element:', canvas);

      if (!canvas) {
        console.warn('[care-image-actions] No canvas found inside viewport element — aborting');
        return;
      }

      canvas.toBlob(async blob => {
        console.log('[care-image-actions] canvas.toBlob() result:', blob);

        if (!blob) {
          console.warn('[care-image-actions] toBlob() returned null — aborting clipboard write');
          return;
        }

        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          console.log('[care-image-actions] clipboard write succeeded');
          uiNotificationService.show({ title: 'Copied', message: 'Image copied to clipboard' });
        } catch (err) {
          console.error('[care-image-actions] clipboard write failed:', err);
          uiNotificationService.show({
            title: 'Copy failed',
            message: err.message,
            type: 'error',
          });
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
