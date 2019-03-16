import english from '../languages/english';
import portuguese from '../languages/portuguese';

const languages = {
    english,
    portuguese
};

const getTranslator = (language) => {
    return (identifier) => {
        const translator = languages[language];
        const fallback = languages['english'];
        return eval(`translator.${identifier} || fallback.${identifier}`);
    };
};

export default getTranslator;