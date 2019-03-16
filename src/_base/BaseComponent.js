import React from 'react';
import PropTypes from 'prop-types';

export default class BaseComponent extends React.Component {

    static contextTypes = {
        ESRI: PropTypes.object,
        setInScope: PropTypes.func,
        scope: PropTypes.object
    };

    class = (extraName, _class) => {
        if (this.baseClass) {
            return this.baseClass + (extraName ? '-' + extraName : '') + (_class ? ' ' + _class : '');
        } else {
            window.console.warn('Component without baseClass set: ' + this);
        }

    };

}
