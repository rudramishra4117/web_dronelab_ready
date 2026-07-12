import { Application, CommandService, HotkeyService, ShowPropertyEventHandler } from "@dronecad/app";
import {
    Config,
    Constants,
    I18n,
    type IApplication,
    type IDataExchange,
    type IService,
    type IShapeFactory,
    type IStorage,
    type IVisualFactory,
    type IWindow,
    type Locale,
    Logger,
} from "@dronecad/core";
import { DefaultDataExchange } from "./defaultDataExchange";

export class AppBuilder {
    protected readonly _inits: (() => Promise<void>)[] = [];
    protected _storage?: IStorage;
    protected _visualFactory?: IVisualFactory;
    protected _shapeFactory?: IShapeFactory;
    protected _window?: IWindow;

    constructor() {
        this.initI18n();
        this.initConfig();
        this.ensureAPI();
    }

    protected ensureAPI() {
        this._inits.push(async () => {
            Logger.info("initializing api");

            (globalThis as any).DroneCADCore = await import("@dronecad/core");
            (globalThis as any).DroneCADElement = await import("@dronecad/element");
        });
    }

    protected initConfig() {
        Config.instance.init("config");
        return this;
    }

    protected initI18n() {
        this._inits.push(async () => {
            Logger.info("initializing i18n");

            const i18n = await import("@dronecad/i18n");
            for (const key of Object.keys(i18n)) {
                I18n.addLanguage((i18n as { [key: string]: Locale })[key]);
            }
        });
    }

    useIndexedDB() {
        this._inits.push(async () => {
            Logger.info("initializing IndexedDBStorage");

            const db = await import("@dronecad/storage");
            this._storage = new db.IndexedDBStorage();
            await this._storage.createDBIfNeeded(Constants.DBName, [
                Constants.DocumentTable,
                Constants.RecentTable,
            ]);
        });
        return this;
    }

    useWasmOcc() {
        this._inits.push(async () => {
            Logger.info("initializing wasm occ");

            const wasm = await import("@dronecad/wasm");
            await wasm.initWasm();
            this._shapeFactory = new wasm.ShapeFactory();
        });
        return this;
    }

    useThree(): this {
        this._inits.push(async () => {
            Logger.info("initializing three");

            const three = await import("@dronecad/three");
            this._visualFactory = new three.ThreeVisulFactory((d) => new ShowPropertyEventHandler(d));
        });
        return this;
    }

    useUI(): this {
        this._inits.push(async () => {
            Logger.info("initializing MainWindow");

            const ui = await import("@dronecad/ui");
            const app = document.getElementById("app") as HTMLElement;
            this._window = new ui.MainWindow(
                await this.getRibbonTabs(),
                "https://unpkg.com/@phosphor-icons/web",
                app,
            );
        });
        return this;
    }

    async getRibbonTabs() {
        const defaultRibbon = await import("./ribbon");
        const ribbon = [...defaultRibbon.DefaultRibbon];

        try {
            const response = await fetch(`/api/content/cad-models?t=${Date.now()}`);
            if (response.ok) {
                const manifest = await response.json();

                // Register dynamic commands
                const appCmds = await import("@dronecad/app");
                if (appCmds.registerDynamicComponentCommands) {
                    appCmds.registerDynamicComponentCommands(manifest);
                }

                if (manifest.components && Object.keys(manifest.components).length > 0) {
                    const groups = Object.keys(manifest.components).map((category) => {
                        return {
                            groupName: category as any,
                            items: manifest.components[category].map(
                                (item: any) => `insertComponent.${item.id}`,
                            ),
                        };
                    });

                    // Add Components tab
                    ribbon.push({
                        tabName: "ribbon.tab.components" as any,
                        groups: groups,
                    });

                    // Add translations for tab and groups
                    const translations: Record<string, string> = {
                        "ribbon.tab.components": "Components",
                    };
                    for (const category of Object.keys(manifest.components)) {
                        translations[`ribbon.group.${category}`] = category;
                        translations[`ribbon.group.${category.replace(/ /g, "")}`] = category;
                        translations[category] = category; // Just in case
                    }

                    const { I18n } = await import("@dronecad/core");
                    I18n.combineTranslation("en", translations);
                }
            }
        } catch (e) {
            Logger.warn("Failed to load components for ribbon: " + e);
        }

        return ribbon;
    }

    async build(): Promise<IApplication> {
        for (const init of this._inits) {
            await init();
        }
        this.ensureNecessary();

        const app = this.createApp();
        await this._window?.init(app);
        await this.loadDefaultPlugins(app);

        Logger.info("Application build completed");

        return app;
    }

    protected async loadDefaultPlugins(app: IApplication) {
        const folderUrl = window.location.origin + "/plugins/";
        try {
            const response = await fetch(folderUrl + "plugins.json");
            if (!response.ok) {
                return;
            }
            const config = await response.json();
            const plugins = config.plugins as string[];
            for (const plugin of plugins ?? []) {
                await app.pluginManager.loadFromUrl(folderUrl + plugin);
            }
        } catch {
            Logger.warn(`Failed to load plugins from folder: ${folderUrl}`);
        }
    }

    createApp() {
        return new Application({
            storage: this._storage!,
            shapeFactory: this._shapeFactory!,
            visualFactory: this._visualFactory!,
            services: this.getServices(),
            mainWindow: this._window,
            dataExchange: this.initDataExchange(),
        });
    }

    initDataExchange(): IDataExchange {
        return new DefaultDataExchange();
    }

    private ensureNecessary() {
        if (this._shapeFactory === undefined) {
            throw new Error("ShapeFactory not set");
        }
        if (this._visualFactory === undefined) {
            throw new Error("VisualFactory not set");
        }
        if (this._storage === undefined) {
            throw new Error("storage has not been initialized");
        }
    }

    protected getServices(): IService[] {
        return [new CommandService(), new HotkeyService()];
    }
}
