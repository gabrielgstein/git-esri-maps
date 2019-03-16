'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

var _BaseComponent2 = require('../../_base/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _scope = require('../../scope');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ManageWorkspacesModule = function (_BaseComponent) {
    _inherits(ManageWorkspacesModule, _BaseComponent);

    function ManageWorkspacesModule() {
        var _temp, _this, _ret;

        _classCallCheck(this, ManageWorkspacesModule);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseComponent.call.apply(_BaseComponent, [this].concat(args))), _this), _this.baseClass = 'manage-workspaces-module', _temp), _possibleConstructorReturn(_this, _ret);
    }

    ManageWorkspacesModule.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            workspaces = _props.workspaces,
            changeWorkspace = _props.changeWorkspace;


        var dataSource = [];

        for (var workspaceId in workspaces) {
            var workspace = workspaces[workspaceId];
            dataSource.push(workspace);
        }

        var columns = [{
            title: (0, _scope.translate)('MANAGE_WORKSPACES_MODULE.WORKSPACE'),
            dataIndex: 'title',
            key: 'title',
            sorter: function sorter(a, b) {
                return a.title.localeCompare(b.title);
            }
        }, {
            title: (0, _scope.translate)('MANAGE_WORKSPACES_MODULE.DATE'),
            dataIndex: 'date',
            key: 'date',
            sorter: function sorter(a, b) {
                return a.date.localeCompare(b.date);
            }
        }, {
            title: '',
            key: 'action',
            render: function render(text, record) {

                var onMenuItemClick = function onMenuItemClick(_ref) {
                    var key = _ref.key;

                    switch (key) {
                        case 'loadWorkspace':
                            changeWorkspace(record.workspaceId);
                    }
                };

                var menu = _react2.default.createElement(
                    _antd.Menu,
                    { onClick: onMenuItemClick },
                    _react2.default.createElement(
                        _antd.Menu.Item,
                        { key: "loadWorkspace" },
                        _react2.default.createElement(
                            'span',
                            null,
                            _react2.default.createElement(_antd.Icon, { type: 'reload' }),
                            ' ' + (0, _scope.translate)('MANAGE_WORKSPACES_MODULE.LOAD_WORKSPACE')
                        )
                    )
                );

                return _react2.default.createElement(
                    'span',
                    { className: _this2.class('more-actions') },
                    _react2.default.createElement(
                        _antd.Dropdown,
                        { overlay: menu, placement: 'bottomLeft' },
                        _react2.default.createElement(_antd.Button, { icon: "ellipsis", shape: "circle", size: "small" })
                    )
                );
            }
        }];

        return _react2.default.createElement(
            'div',
            { className: this.class() },
            _react2.default.createElement(
                'div',
                { className: this.class('workspace-table') },
                _react2.default.createElement(_antd.Table, {
                    size: "small",
                    pagination: false,
                    rowKey: function rowKey(record) {
                        return record.workspaceId;
                    },
                    dataSource: dataSource,
                    columns: columns
                })
            )
        );
    };

    return ManageWorkspacesModule;
}(_BaseComponent3.default);

exports.default = ManageWorkspacesModule;
module.exports = exports['default'];