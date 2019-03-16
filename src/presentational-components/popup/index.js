import React from "react";
import update from 'immutability-helper';
import {Button, Checkbox} from 'antd';
import FeatureHelper from '../../helpers/FeatureHelper';
import BaseComponent from "../../_base/BaseComponent";
import {translate} from '../../scope';

export default class PopupComponent extends BaseComponent {

    baseClass = 'popup-component';

    state = {
        top: undefined,
        left: undefined
    };

    timer = undefined;

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(nextProps) {
        this.updatePopupPosition(nextProps);
    }

    render() {

        const props = this.props;
        const {
            shown,
            onClosePopup,
            updatePopupPosition,
            onSelectFeatureChange,
            attributes,
            config,
            onMouseOverPopup,
            selectedFeatures,
            partialSelectedFeatures,
            hoverGraphicId,
            hoverLayerId,
            hoverPromptConfig,
            onApplyGraphicAsFilter
        } = props;

        const { top, left } = this.state;

        const allSelectedFeatures = Object.assign({}, selectedFeatures, partialSelectedFeatures);

        const {title, subtitle, image} = config || {};

        if (shown) {
            this.showPopup();
        }

        const visible = shown && (image || title || subtitle || hoverPromptConfig);

        return (
            <div
                className={this.class()}
                onMouseOver={() => onMouseOverPopup(true)}
                onMouseLeave={() => onMouseOverPopup(false)}
                ref={el => this.popup = el}
                style={{
                    opacity: visible ? 1 : 0,
                    top: top || 0,
                    left: left || 0,
                    visibility: visible ? 'visible' : 'hidden'
                }}
            >
                {image &&
                <div className={this.class('image')}>
                    <img src={FeatureHelper.getMetrics(image, attributes)} alt="" onLoad={() => this.updatePopupPosition(this.props)}/>
                </div>
                }

                <div className={this.class('body')}>

                    {title &&
                        <div className={this.class('title')}>
                            {FeatureHelper.getMetrics(title, attributes)}
                        </div>
                    }

                    {subtitle &&
                        <div className={this.class('subtitle')}>
                            {FeatureHelper.getMetrics(subtitle, attributes)}
                        </div>
                    }

                    {hoverPromptConfig ?
                        <div className={this.class('actions')}>
                            <span className={this.class('apply')}>
                                <Button type="primary" icon="check" onClick={() => onApplyGraphicAsFilter(hoverLayerId, hoverGraphicId)}>
                                    {translate('POPUP.APPLY_FILTER')}
                                </Button>
                            </span>
                            <Checkbox checked={!!allSelectedFeatures[hoverGraphicId]} onChange={(e) => onSelectFeatureChange(e.target.checked, hoverLayerId, hoverGraphicId)}>
                                {translate('POPUP.SELECT')}
                            </Checkbox>
                        </div>
                        : null
                    }

                </div>
                <div className="arrow-down" />
            </div>
        );
    }


    showPopup = () => {
        const popup = this.popup || {};

        let currentHeight = popup.offsetHeight;
        let currentWidth = popup.offsetWidth;

        const clear = () => {
            if (this.timer) {
                clearInterval(this.timer);
                delete this.timer;
            }
        };

        clear();

        let attempts = 0;

        const attemptShowFn = () => {
            if (currentHeight === popup.offsetHeight && currentWidth === popup.offsetWidth) {
                attempts += 1;
            } else {
                currentHeight = popup.offsetHeight;
                currentWidth = popup.offsetWidth;
                attempts = 0;
            }

            if (attempts === 20) {
                this.updatePopupPosition(this.props);
                clear();
            }

        };

        this.timer = setInterval(attemptShowFn, 50);

        attemptShowFn();
    };

    updatePopupPosition = (props) => {
        const {position} = props;
        const {x, y} = position || {};
        const popup = this.popup;
        const top = y - popup.offsetHeight - 10;
        const left = x - (popup.offsetWidth / 2);
        this.setState(state => update(state, {
            top: {
                $set: top
            },
            left: {
                $set: left
            }
        }));
    };

    renderMetrics = (metrics) => {

        return metrics.map((metric, index) => {

            return (
                <div className={this.class('metric')} key={index}>

                    <div className={this.class('label')}>
                        {this.getGroupedTexts(metric.label)}
                    </div>

                    <div className={this.class('value')}>
                        {this.getGroupedTexts(metric.value)}
                    </div>

                </div>
            )

        });

    };

    getGroupedTexts = (group) => {

        const {feature} = this.props;
        const attributes = feature.attributes;

        return FeatureHelper.getMetrics(group, attributes);

    };

}
