import {
    Constants,
    I18n,
    type I18nKeys,
    type IApplication,
    Localize,
    ObservableCollection,
    PubSub,
    type RecentDocumentDTO,
} from "@dronecad/core";
import { a, button, collection, div, img, label, span, svg } from "@dronecad/element";
import style from "./home.module.css";
import { LanguageSelector } from "./languageSelector";
import { Navigation3DSelector } from "./navigation3DSelector";
import { ThemeSelector } from "./themeSelector";

interface ApplicationCommand {
    display: I18nKeys;
    icon?: string;
    onclick: () => void;
}

const applicationCommands = new ObservableCollection<ApplicationCommand>(
    {
        display: "command.doc.new",
        onclick: () => PubSub.default.pub("executeCommand", "doc.new"),
    },
    {
        display: "command.doc.open",
        onclick: () => PubSub.default.pub("executeCommand", "doc.open"),
    },
);

export class Home extends HTMLElement {
    constructor(readonly app: IApplication) {
        super();
        this.className = style.root;
    }

    private hasOpen(documentId: string) {
        for (const document of this.app.documents) {
            if (document.id === documentId) return true;
        }
        return false;
    }

    private async getDocuments() {
        return new ObservableCollection(
            ...(await this.app.storage.page(Constants.DBName, Constants.RecentTable, 0)),
        );
    }

    private async getTemplates() {
        try {
            const response = await fetch(`/api/content/cad-models?t=${Date.now()}`);
            if (response.ok) {
                const manifest = await response.json();
                return new ObservableCollection(...(manifest.templates || []));
            }
        } catch (e) {
            console.error("Failed to load templates:", e);
        }
        return new ObservableCollection();
    }

    async render() {
        const documents = await this.getDocuments();
        const templates = await this.getTemplates();
        this.append(this.leftSection(), this.rightSection(documents, templates));
        this.app.mainWindow?.appendChild(this);
    }

    private leftSection() {
        return div(
            { className: style.left },
            div(
                { className: style.top },
                this.logoSection(),
                this.applicationCommands(),
                this.currentDocument(),
                button({
                    className: style.button,
                    textContent: "Back to Main Site",
                    onclick: () => {
                        window.location.href = "/";
                    },
                })
            ),

            this.settings(),
        );
    }

    private logoSection() {
        return div(
            { className: style.logo },
            (() => {
                const i = document.createElement("img");
                i.src = "logo.png";
                i.style.height = "64px";
                i.style.objectFit = "contain";
                return i;
            })(),
            span({ textContent: "NIELIT Drone CAD" }),
        );
    }

    private applicationCommands() {
        return collection({
            className: style.buttons,
            sources: applicationCommands,
            template: (item, index) =>
                button({
                    id: index === 0 ? "tour-new-document" : undefined,
                    className: style.button,
                    textContent: new Localize(item.display),
                    onclick: item.onclick,
                }),
        });
    }

    private currentDocument() {
        return this.app.activeView?.document
            ? button({
                  className: `${style.button} ${style.back}`,
                  textContent: new Localize("common.back"),
                  onclick: () => {
                      PubSub.default.pub("displayHome", false);
                  },
              })
            : "";
    }

    private settings() {
        return div(
            { className: style.settingsPanel },
            div(
                { className: style.settingItem },
                span({
                    className: style.settingLabel,
                    textContent: new Localize("common.language"),
                }),
                div({ className: style.settingControl }, LanguageSelector({})),
            ),
            div(
                { className: style.settingItem },
                span({
                    className: style.settingLabel,
                    textContent: new Localize("common.theme"),
                }),
                div({ className: style.settingControl }, ThemeSelector({})),
            ),
            div(
                { className: style.settingItem },
                span({
                    className: style.settingLabel,
                    textContent: new Localize("common.3DNavigation"),
                }),
                div({ className: style.settingControl }, Navigation3DSelector({})),
            ),
            div(
                { className: style.settingItem, style: "justify-content: center; margin-top: 16px;" },
                button(
                    {
                        id: "tour-start-button",
                        className: style.tourButton,
                        onclick: async () => {
                            const { startHomeTour } = await import("./tour");
                            startHomeTour();
                        },
                    },
                    span({ textContent: "Take a quick tour" }),
                    div(
                        { className: style.tourIcon },
                        (() => {
                            const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                            svgNode.setAttribute("viewBox", "0 0 24 24");
                            svgNode.setAttribute("height", "24");
                            svgNode.setAttribute("width", "24");
                            svgNode.innerHTML = `<path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path>`;
                            return svgNode;
                        })(),
                    ),
                ),
            ),
        );
    }

    private rightSection(
        documents: ObservableCollection<RecentDocumentDTO>,
        templates: ObservableCollection<any>,
    ) {
        return div(
            { className: style.right },
            label({ className: style.welcome, textContent: new Localize("home.welcome") }),

            div({ id: "tour-get-started", className: style.recent, textContent: "Get Started" }),
            this.templateCollection(templates),

            div({ className: style.recent, textContent: new Localize("home.recent") }),
            this.documentCollection(documents),
        );
    }

    private templateCollection(templates: ObservableCollection<any>) {
        return collection({
            className: `${style.documents} ${style.horizontal}`,
            sources: templates,
            template: (item) => this.templateDocument(item),
        });
    }

    private templateDocument(item: any) {
        return div(
            {
                className: style.document,
                onclick: () => this.handleTemplateClick(item),
            },
            img({ className: style.img, src: item.image || "logo.png" }),
            div({ className: style.description }, span({ className: style.title, textContent: item.name })),
        );
    }

    private documentCollection(documents: ObservableCollection<RecentDocumentDTO>) {
        return collection({
            className: style.documents,
            sources: documents,
            template: (item) => this.recentDocument(item, documents),
        });
    }

    private recentDocument(item: RecentDocumentDTO, documents: ObservableCollection<RecentDocumentDTO>) {
        return div(
            {
                className: style.document,
                onclick: () => this.handleDocumentClick(item),
            },
            img({ className: style.img, src: item.image }),
            this.documentDescription(item),
            this.deleteIcon(item, documents),
        );
    }

    private documentDescription(item: RecentDocumentDTO) {
        return div(
            { className: style.description },
            span({ className: style.title, textContent: item.name }),
            span({
                className: style.date,
                textContent: new Date(item.date).toLocaleDateString(),
            }),
        );
    }

    private deleteIcon(item: RecentDocumentDTO, documents: ObservableCollection<RecentDocumentDTO>) {
        return svg({
            className: style.delete,
            icon: "icon-times",
            onclick: async (e) => {
                e.stopPropagation();
                if (window.confirm(I18n.translate("prompt.deleteDocument{0}", item.name))) {
                    await Promise.all([
                        this.app.storage.delete(Constants.DBName, Constants.DocumentTable, item.id),
                        this.app.storage.delete(Constants.DBName, Constants.RecentTable, item.id),
                    ]);
                    documents.remove(item);
                }
            },
        });
    }

    private handleDocumentClick(item: RecentDocumentDTO) {
        if (this.hasOpen(item.id)) {
            PubSub.default.pub("displayHome", false);
        } else {
            PubSub.default.pub(
                "showPermanent",
                async () => {
                    const document = await this.app.openDocument(item.id);
                    document?.application.activeView?.cameraController.fitContent();
                },
                "toast.excuting{0}",
                I18n.translate("command.doc.open"),
            );
        }
    }

    private handleTemplateClick(item: any) {
        PubSub.default.pub(
            "showPermanent",
            async () => {
                const doc = await this.app.newDocument("New Document");
                try {
                    const response = await fetch(item.file);
                    const blob = await response.blob();
                    const fileExt = item.file.substring(item.file.lastIndexOf("."));
                    const file = new File([blob], item.name + fileExt);
                    await this.app.dataExchange.import(doc, [file]);
                    doc.application.activeView?.cameraController.fitContent();
                } catch (e) {
                    console.error("Failed to load template", e);
                }
            },
            "toast.excuting{0}",
            "Load Template",
        );
    }
}

customElements.define("dronecad-home", Home);
