import React from 'react';
import {Button, Tooltip} from 'antd';
import BaseComponent from "../../_base/BaseComponent";
import UIHelper from "../../helpers/UIHelper";
import {translate} from '../../scope';

export default class FilterBar extends BaseComponent {

    baseClass = 'filter-bar';

    render() {

        const {
            selectedFeatures,
            appliedToFilter,
            partialSelectedFeatures,
            onApplyFilterSelection,
            onClearPartialSelections,
            onClearAppliedSelections,
        } = this.props;

        const partialSelectedFeaturesCount = Object.keys(partialSelectedFeatures).length;
        const selectedFeaturesCount = Object.keys(selectedFeatures).length;
        const appliedToFilterCount = Object.keys(appliedToFilter).length;

        if (partialSelectedFeaturesCount === 0 && selectedFeaturesCount === 0) return null;

        return (
            <div className={this.class()}>
                <div className={this.class('icon')}>
                    {UIHelper.getIcon('Funnel', {style: {width: 18, height: 18}})}
                </div>
                <div className={this.class('info')}>
                    {selectedFeaturesCount + partialSelectedFeaturesCount} {translate('FILTER_BAR.FEATURES_SELECTED')}
                    {appliedToFilterCount ? ' - ' + appliedToFilterCount + ` ${translate('FILTER_BAR.APPLIED_FILTER')}` : null}
                </div>
                <div className={this.class('actions')}>
                    {
                        partialSelectedFeaturesCount ?
                            <Tooltip placement="top" title={translate('FILTER_BAR.CLEAR_NOT_APPLIED')}>
                                <Button shape="circle" icon="close" size={"small"} onClick={onClearPartialSelections}/>
                            </Tooltip>
                            :
                            null
                    }

                    {
                        partialSelectedFeaturesCount ?
                            <Tooltip placement="top" title={translate('FILTER_BAR.APPLY_SELECTIONS')}>
                                <Button type="primary" icon="check" size={"small"} onClick={onApplyFilterSelection}>
                                    {translate('FILTER_BAR.APPLY_SELECTIONS')}
                                </Button>
                            </Tooltip> : null
                    }
                    {
                        appliedToFilterCount ?
                        <Tooltip placement="top" title={translate('FILTER_BAR.REMOVE_FILTERS')}>
                            <Button icon="delete" shape={"circle"} size={"small"} type={"danger"} onClick={onClearAppliedSelections}/>
                        </Tooltip>
                        :
                        null
                    }
                </div>
            </div>
        )

    }

}