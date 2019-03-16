import React from 'react';
import {Table, Button, Input} from 'antd';
import UIHelper from '../../helpers/UIHelper';
import {translate} from '../../scope';
import BaseComponent from "../../_base/BaseComponent";

export default class CatalogModule extends BaseComponent {

    baseClass = 'catalog-module';

    state = {
        searchText: ''
    };

    componentWillMount() {
        const {layers} = this.props;
        this.setState({
            layers
        });
    }

    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
    };

    onSearch = () => {
        const {layers} = this.props;
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');

        const filteredLayers = {};

        for (let layerId in layers) {
            const layer = layers[layerId];
            const match = layer.title.match(reg);
            if (!match) continue;
            filteredLayers[layerId] = layer;
        }

        this.setState({
            layers: filteredLayers
        });
    };

    render() {

        const {
            enrichedSources,
            workspace,
            currentWorkspaceSelection,
            onWorkspaceSelectionChange,
            onApplyWorkspaceSelections
        } = this.props;

        const {layers} = this.state;

        const workspaceLayers = workspace.layers;
        const dataSource = [];
        const layersFiltersObj = {};
        const layersFilters = [];

        for (let layerId in layers) {
            const layer = layers[layerId];
            const enrichedSource = enrichedSources[layer.enrichedSource];
            layer.enrichedSourceTag = enrichedSource.tag;
            dataSource.push(layer);
            layersFiltersObj[layer.enrichedSource] = {
                text: enrichedSource.title + ' (' + enrichedSource.tag + ')',
                value: layer.enrichedSource
            };
        }

        for (let enrichedSourceId in layersFiltersObj) {
            layersFilters.push(layersFiltersObj[enrichedSourceId]);
        }

        const onSelectedRowsChange = (selectedRows) => {
            const workspaceSelection = [];
            selectedRows.forEach(selectedRow => {
                workspaceSelection.push(selectedRow.layerId);
            });
            onWorkspaceSelectionChange(workspaceSelection);
        };

        const rowSelection = {
            selectedRowKeys: currentWorkspaceSelection,
            getCheckboxProps: record => {
                return {
                    disabled: !!workspaceLayers[record.layerId] && currentWorkspaceSelection.indexOf(record.layerId) >= 0
                }
            },
            columnWidth: 40,
            onChange: (selectedRowKeys, selectedRows) => {
                onSelectedRowsChange(selectedRows);
            },
            onSelectAll: (selected, selectedRows) => {
                onSelectedRowsChange(selectedRows);
            }
        };

        const removeLayerSelection = (layerId) => {
            const workspaceSelection = currentWorkspaceSelection.slice();
            workspaceSelection.splice(workspaceSelection.indexOf(layerId), 1);
            onWorkspaceSelectionChange(workspaceSelection);
        };

        const columns = [
            {
                title: UIHelper.getIcon('Layers', {style: {width: '18px', height: '18px'}}),
                dataIndex: 'enrichedSourceTag',
                width: 100,
                key: 'enrichedSourceTag',
                filters: layersFilters,
                onFilter: (value, record) => {
                    console.log(columns[0]);
                    return record.enrichedSource == value;
                },
                sorter: (a, b) => a.enrichedSourceTag.localeCompare(b.enrichedSourceTag),
            },
            {
                title: translate('CATALOG_MODULE.ANALYSIS'),
                dataIndex: 'title',
                key: 'title',
                filterDropdown: (
                    <div className="custom-filter-dropdown">
                        <Input
                            ref={ele => console.log(ele)}
                            placeholder={translate('CATALOG_MODULE.SEARCH_NAME')}
                            value={this.state.searchText}
                            onChange={this.onInputChange}
                            onPressEnter={this.onSearch}
                        />
                        <Button type="primary" onClick={this.onSearch}>{translate('CATALOG_MODULE.SEARCH')}</Button>
                    </div>
                ),
                sorter: (a, b) => a.title.localeCompare(b.title),
            },
            {
                title: '',
                key: 'action',
                render: (text, record) => {
                    return workspaceLayers[record.layerId] && currentWorkspaceSelection.indexOf(record.layerId) >= 0 &&
                        <span>
                            <Button shape="circle" icon="delete" size={"small"} onClick={() => removeLayerSelection(record.layerId)}/>
                        </span>
                }
            }];

        return (
            <div className={this.class()}>
                <div className={this.class('actions')}>
                    <Button type="primary" icon="check" onClick={onApplyWorkspaceSelections}>
                        {translate('CATALOG_MODULE.APPLY_SELECTIONS')}
                    </Button>
                </div>
                <div className={this.class('layers-table')}>
                    <Table
                        size={"small"}
                        pagination={false}
                        rowKey={record => record.layerId}
                        rowSelection={rowSelection}
                        dataSource={dataSource}
                        columns={columns}
                    />
                </div>
            </div>
        )

    }

}