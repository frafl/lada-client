/* Copyright (c) 2017 Bundesamt fuer Strahlenschutz
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @class Lada.view.window.ImprintModel
 */
Ext.define('Lada.model.HelpprintModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.k-window-imprint',

    formulas: {
        selectionHtml: function(get) {
            var selection = get('treelist.selection'),
                view = this.getView(),
                imprintController = view.getController(),
                imprintHtmlUrl;

            if (selection) {
                imprintHtmlUrl = (selection.getData()) ? selection.getData().content : null;
                imprintController.setHtmlInPanel(imprintHtmlUrl);
            } else {
                return 'No node selected';
            }
        }
    },

    stores: {
        imprintNavItems: {
            type: 'tree',
            root: {
                children: [{
                    id: 'intro',
                    text: 'Einführung',
                    content: 'resources/ladaHelp/intro.html',
                    leaf: true
                }, {
                    id: 'query',
                    text: 'Query',
                    content: 'resources/ladaHelp/query.html',
                    leaf: true
                }, {
                    id: 'probe',
                    text: 'Proben-Fenster',
                    content: 'resources/ladaHelp/probe.html',
                    leaf: true
                }, {
                    id: 'messung',
                    text: 'Messungs-Fenster',
                    content: 'resources/ladaHelp/messung.html',
                    leaf: true
                }, {
                    id: 'ort',
                    text: 'Orte-Fenster',
                    content: 'resources/ladaHelp/ort.html',
                    leaf: true
                }, {
                    id: 'messprogramm',
                    text: 'Messprogramm-Fenster',
                    content: 'resources/ladaHelp/messprogramm.html',
                    leaf: true
                }, {
                    id: 'glossar',
                    text: 'Glossar',
                    content: 'resources/ladaHelp/glossar.html',
                    leaf: true
                }
                ]
            }
        }
    }
});
