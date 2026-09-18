// extensions/care-image-actions/getCommandsModule.js
export default function getCommandsModule({ servicesManager }) {
  const { viewportGridService, cornerstoneViewportService, uiNotificationService } =
    servicesManager.services;

  const actions = {
    copyViewportImage: async () => {
      const { activeViewportId } = viewportGridService.getState();
      const canvas = cornerstoneViewportService
        .getViewportInfo(activeViewportId)
        .getElement()
        .querySelector('canvas');

      canvas.toBlob(async blob => {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        uiNotificationService.show({ title: 'Copied', message: 'Image copied to clipboard' });
      });
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
