import { CommandStore, I18n, type IApplication, type ICommand, PubSub } from "@dronecad/core";

export function registerDynamicComponentCommands(manifest: any) {
    if (!manifest || !manifest.components) return;

    for (const category of Object.keys(manifest.components)) {
        for (const item of manifest.components[category]) {
            const commandKey = `insertComponent.${item.id}`;

            class DynamicInsertCommand implements ICommand {
                async execute(application: IApplication): Promise<void> {
                    PubSub.default.pub(
                        "showPermanent",
                        async () => {
                            try {
                                const response = await fetch(item.file);
                                const blob = await response.blob();
                                const fileExt = item.file.substring(item.file.lastIndexOf("."));
                                const file = new File([blob], item.name + fileExt);
                                await application.dataExchange.import(application.activeView?.document!, [
                                    file,
                                ]);
                                application.activeView?.cameraController.fitContent();
                            } catch (e) {
                                console.error("Failed to insert component", e);
                            }
                        },
                        "toast.excuting{0}",
                        item.name,
                    );
                }
            }

            CommandStore.registerCommand(DynamicInsertCommand, {
                key: commandKey as any,
                icon: "icon-import", // Using generic import icon for all components
            });

            // Register translation
            const t = { [`command.${commandKey}`]: item.name };
            I18n.combineTranslation("en", t);
            I18n.combineTranslation(I18n.currentLanguage(), t);
        }
    }
}
