import React, { useState } from 'react';

import { Typography } from '@alfalab/core-components-typography';

import { Questions } from './questions';
import { KeepCssVars } from './answers/keepCssVars';
import { config, defaultByProduct } from './config';
import { Answers, Question } from './types';
import { DropCssVars } from './answers/dropCssVars';

export const ThemingWizard = () => {
    const [answers, setAnswers] = useState(defaultByProduct.default);

    const handleChange = (newAnswers: Answers, question: Question['name']) => {
        if (question === 'product') {
            setAnswers({
                ...newAnswers,
                ...(defaultByProduct[newAnswers.product] || {}),
            });
        } else {
            setAnswers(newAnswers);
        }
    };

    return (
        <React.Fragment>
            <Questions config={config} answers={answers} onChange={handleChange} />

            <Typography.Title tag='h3' defaultMargins={true} view="small">
                Настройка темизации
            </Typography.Title>

            {answers.keepCssVars === 'yes' ? (
                <KeepCssVars answers={answers} />
            ) : (
                <DropCssVars answers={answers} />
            )}
        </React.Fragment>
    );
};
