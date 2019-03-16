'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

var _UIHelper = require('../../helpers/UIHelper');

var _UIHelper2 = _interopRequireDefault(_UIHelper);

var _scope = require('../../scope');

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CatalogModule = function (_BaseComponent) {
    _inherits(CatalogModule, _BaseComponent);

    function CatalogModule() {
        var _temp, _this, _ret;

        _classCallCheck(this, CatalogModule);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'catalog-module', _this.state = {
            searchText: ''
        }, _this.onInputChange = function (e) {
            _this.setState({ searchText: e.target.value });
        }, _this.onSearch = function () {
            var layers = _this.props.layers;
            var searchText = _this.state.searchText;

            var reg = new RegExp(searchText, 'gi');

            var filteredLayers = {};

            for (var layerId in layers) {
                var layer = layers[layerId];
                var match = layer.title.match(reg);
                if (!match) continue;
                filteredLayers[layerId] = layer;
            }

            _this.setState({
                layers: filteredLayers
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    CatalogModule.prototype.componentWillMount = function componentWillMount() {
        var layers = this.props.layers;

        this.setState({
            layers: layers
        });
    };

    CatalogModule.prototype.render = function render() {
        var _props = this.props,
            enrichedSources = _props.enrichedSources,
            workspace = _props.workspace,
            currentWorkspaceSelection = _props.currentWorkspaceSelection,
            onWorkspaceSelectionChange = _props.onWorkspaceSelectionChange,
            onApplyWorkspaceSelections = _props.onApplyWorkspaceSelections;
        var layers = this.state.layers;


        var workspaceLayers = workspace.layers;
        var dataSource = [];
        var layersFiltersObj = {};
        var layersFilters = [];

        for (var layerId in layers) {
            var layer = layers[layerId];
            var enrichedSource = enrichedSources[layer.enrichedSource];
            layer.enrichedSourceTag = enrichedSource.tag;
            dataSource.push(layer);
            layersFiltersObj[layer.enrichedSource] = {
                text: enrichedSource.title + ' (' + enrichedSource.tag + ')',
                value: layer.enrichedSource
            };
        }

        for (var enrichedSourceId in layersFiltersObj) {
            layersFilters.push(layersFiltersObj[enrichedSourceId]);
        }

        var onSelectedRowsChange = function onSelectedRowsChange(selectedRows) {
            var workspaceSelection = [];
            selectedRows.forEach(function (selectedRow) {
                workspaceSelection.push(selectedRow.layerId);
            });
            onWorkspaceSelectionChange(workspaceSelection);
        };

        var rowSelection = {
            selectedRowKeys: currentWorkspaceSelection,
            getCheckboxProps: function getCheckboxProps(record) {
                return {
                    disabled: !!workspaceLayers[record.layerId] && currentWorkspaceSelection.indexOf(record.layerId) >= 0
                };
            },
            columnWidth: 40,
            onChange: function onChange(selectedRowKeys, selectedRows) {
                onSelectedRowsChange(selectedRows);
            },
            onSelectAll: function onSelectAll(selected, selectedRows) {
                onSelectedRowsChange(selectedRows);
            }
        };

        var removeLayerSelection = function removeLayerSelection(layerId) {
            var workspaceSelection = currentWorkspaceSelection.slice();
            workspaceSelection.splice(workspaceSelection.indexOf(layerId), 1);
            onWorkspaceSelectionChange(workspaceSelection);
        };

        var columns = [{
            title: _UIHelper2.default.getIcon('Layers', { style: { width: '18px', height: '18px' } }),
            dataIndex: 'enrichedSourceTag',
            width: 100,
            key: 'enrichedSourceTag',
            filters: layersFilters,
            onFilter: function onFilter(value, record) {
                console.log(columns[0]);
                return record.enrichedSource == value;
            },
            sorter: function sorter(a, b) {
                return a.enrichedSourceTag.localeCompare(b.enrichedSourceTag);
            }
        }, {
            title: (0, _scope.translate)('CATALOG_MODULE.ANALYSIS'),
            dataIndex: 'title',
            key: 'title',
            filterDropdown: _react2.default.createElement(
                'div',
                { className: 'custom-filter-dropdown' },
                _react2.default.createElement(_antd.Input, {
                    ref: function ref(ele) {
                        return console.log(ele);
                    },
                    placeholder: (0, _scope.translate)('CATALOG_MODULE.SEARCH_NAME'),
                    value: this.state.searchText,
                    onChange: this.onInputChange,
                    onPressEnter: this.onSearch
                }),
                _react2.default.createElement(
                    _antd.Button,
                    { type: 'primary', onClick: this.onSearch },
                    (0, _scope.translate)('CATALOG_MODULE.SEARCH')
                )
            ),
            sorter: function sorter(a, b) {
                return a.title.localeCompare(b.title);
            }
        }, {
            title: '',
            key: 'action',
            render: function render(text, record) {
                return workspaceLayers[record.layerId] && currentWorkspaceSelection.indexOf(record.layerId) >= 0 && _react2.default.createElement(
                    'span',
                    null,
                    _react2.default.createElement(_antd.Button, { shape: 'circle', icon: 'delete', size: "small", onClick: function onClick() {
                            return removeLayerSelection(record.layerId);
                        } })
                );
            }
        }];

        return _react2.default.createElement(
            'div',
            { className: this.class() },
            _react2.default.createElement(
                'div',
                { className: this.class('actions') },
                _react2.default.createElement(
                    _antd.Button,
                    { type: 'primary', icon: 'check', onClick: onApplyWorkspaceSelections },
                    (0, _scope.translate)('CATALOG_MODULE.APPLY_SELECTIONS')
                )
            ),
            _react2.default.createElement(
                'div',
                { className: this.class('layers-table') },
                _react2.default.createElement(_antd.Table, {
                    size: "small",
                    pagination: false,
                    rowKey: function rowKey(record) {
                        return record.layerId;
                    },
                    rowSelection: rowSelection,
                    dataSource: dataSource,
                    columns: columns
                })
            )
        );
    };

    return CatalogModule;
}(_BaseComponent3.default);

exports.default = CatalogModule;
module.exports = exports['default'];