import React from 'react';
import {Table, Button, Menu, Icon, Dropdown} from 'antd';
import BaseComponent from "../../_base/BaseComponent";
import {translate} from '../../scope';

export default class ManageWorkspacesModule extends BaseComponent {

    baseClass = 'manage-workspaces-module';

    render() {

        const {
            workspaces,
            changeWorkspace
        } = this.props;

        const dataSource = [];

        for (let workspaceId in workspaces) {
            const workspace = workspaces[workspaceId];
            dataSource.push(workspace);
        }

        const columns = [
            {
                title: translate('MANAGE_WORKSPACES_MODULE.WORKSPACE'),
                dataIndex: 'title',
                key: 'title',
                sorter: (a, b) => a.title.localeCompare(b.title),
            },
            {
                title: translate('MANAGE_WORKSPACES_MODULE.DATE'),
                dataIndex: 'date',
                key: 'date',
                sorter: (a, b) => a.date.localeCompare(b.date),
            },
            {
                title: '',
                key: 'action',
                render: (text, record) => {

                    const onMenuItemClick = ({key}) => {
                        switch (key) {
                            case 'loadWorkspace':
                                changeWorkspace(record.workspaceId);
                        }
                    };

                    const menu = (
                        <Menu onClick={onMenuItemClick}>
                            <Menu.Item key={"loadWorkspace"}>
                                <span>
                                    <Icon type="reload"/>
                                    {` ${translate('MANAGE_WORKSPACES_MODULE.LOAD_WORKSPACE')}`}
                                </span>
                            </Menu.Item>
                        </Menu>
                    );

                    return (
                        <span className={this.class('more-actions')}>
                            <Dropdown overlay={menu} placement="bottomLeft">
                                <Button icon={"ellipsis"} shape={"circle"} size={"small"} />
                            </Dropdown>
                        </span>
                    )
                }
            }
        ];

        return (
            <div className={this.class()}>
                <div className={this.class('workspace-table')}>
                    <Table
                        size={"small"}
                        pagination={false}
                        rowKey={record => record.workspaceId}
                        dataSource={dataSource}
                        columns={columns}
                    />
                </div>
            </div>
        )

    }

}