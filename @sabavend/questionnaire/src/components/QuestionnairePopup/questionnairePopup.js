import React from 'react';
import { shape, string, arrayOf, number } from 'prop-types';

import useQuestionnairePopup,{ ANSWER_YES, ANSWER_NO } from '@sabavend/questionnaire/src/talons/useQuestionnairePopup';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useIntl } from "react-intl";
import { Form } from "informed";
import Button from '@magento/venia-ui/lib/components/Button';

import defaultClasses from './questionnairePopup.module.css';

const QuestionnairePopup = ({ cartItems, classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);
    const { formatMessage } = useIntl();
    const {
        title,
        questions,
        formHeading,
        handleClose,
        handleSubmit,
        errors,
        handleAnswer,
        isOpen,
        responses,
        error,
        isQueryLoading,
        isMutationLoading
    } = useQuestionnairePopup({ cartItems });

    if (!isOpen || isQueryLoading) {
        return null;
    }

    if (error) {
        return <div>{ error.message }</div>
    }

    return (
        <div className={classes.questionnaireWrapper}>
            <div className={classes.content}>
                <div className={classes.header}>
                    <Button priority="high" onClick={handleClose} className={classes.closeButton}>
                        ✕
                    </Button>
                    <h2 className={classes.surveyTitle}>{title}</h2>
                </div>
                <Form onSubmit={handleSubmit}>
                    <h2 className={classes.formHeading}>{formHeading}</h2>
                    {questions.map((question, idx) => (
                        <div key={idx} className={classes.questionWrapper}>
                            <div className={classes.query}>
                                {formatMessage({id: `questionnaire.${question}`, defaultMessage: question})}
                            </div>
                            <div className={classes.answerSection}>
                                <Button
                                    priority="normal"
                                    className={`${classes.answerOption} ${responses[idx] === ANSWER_YES ? classes.active : ''}`}
                                    type="button"
                                    onClick={handleAnswer.bind(null, idx, ANSWER_YES)}
                                >
                                    {formatMessage({id: 'questionnaire.optionYes', defaultMessage: 'Yes'})}
                                </Button>
                                <Button
                                    priority="normal"
                                    className={`${classes.answerOption} ${responses[idx] === ANSWER_NO ? classes.active : ''}`}
                                    type="button"
                                    onClick={handleAnswer.bind(null, idx, ANSWER_NO)}
                                >
                                    {formatMessage({id: 'questionnaire.optionNo', defaultMessage: 'No'})}
                                </Button>
                            </div>
                            {errors[idx] && (
                                <div className={classes.errorMessage}>
                                    {errors[idx]}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className={classes.submitSectionWrapper}>
                        <Button disabled={isMutationLoading} priority="high" type="submit">
                            {formatMessage({id: 'questionnaire.submit', defaultMessage: 'Submit'})}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

QuestionnairePopup.propTypes = {
    classes: shape({
        questionnaireWrapper: string,
        content: string,
        formHeading: string,
        header: string,
        surveyTitle: string,
        errorMessage: string,
        questionWrapper: string,
        query: string,
        answerSection: string,
        answerOption: string,
        closeButton: string,
        submitSectionWrapper: string
    }),
    cartItems: arrayOf(
        shape({
            __typename: string,
            uid: string,
            product: shape({
                __typename: string,
                uid: string,
                stock_status: string,
                sku: string.isRequired,
                name: string,
                thumbnail: shape({
                    __typename: string,
                    url: string
                })
            }),
            prices: shape({
                __typename: string,
                price: shape({
                    __typename: string,
                    currency: string,
                    value: number
                }),
                row_total: shape({
                    __typename: string,
                    value: number
                }),
                total_item_discount: shape({
                    __typename: string,
                    value: number
                })
            }),
            quantity: number
        })
    ).isRequired
};

export default QuestionnairePopup;
