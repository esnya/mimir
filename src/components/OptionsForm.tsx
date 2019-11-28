import React from 'react';
import { Form, FormInput, FormGroup, FormSelect } from 'semantic-ui-react';
import _ from 'lodash';
import Options from '../types/Options';
import { monsters } from '../data/monsters.json';

export interface OptionsFormProps {
  options: Options;
  onChange: (value: Partial<Options>) => void;
}

function getAttributes(path: string): string[] {
  return _(monsters)
    .map(monster => _.get(monster, path, null))
    .filter(value => Boolean(value))
    .uniq()
    .sort()
    .value() as string[];
}

const races = getAttributes('base.種族');
const elements = getAttributes('base.属性');
const sizes = getAttributes('base.サイズ');

export default React.memo(function ControlForm({
  options,
  onChange,
}: OptionsFormProps): JSX.Element {
  const numberInput = (key: keyof Options, label: string): JSX.Element => {
    return (
      <FormInput
        label={label}
        type="number"
        value={options[key]}
        onChange={(_e, { value }): void =>
          onChange({ [key]: value ? Number(value) : undefined })
        }
      />
    );
  };

  const select = (
    key: keyof Options,
    values: string[],
    label: string,
  ): JSX.Element => {
    return (
      <FormSelect
        label={label}
        multiple
        options={values.map(v => ({ text: v, value: v }))}
        value={options[key] || values}
        onChange={(_e, { value }): void => {
          onChange({ [key]: (value as string[] | undefined) || undefined });
        }}
      />
    );
  };

  return (
    <Form>
      {numberInput('baseLevel', 'Baseレベル')}
      <FormGroup>
        {numberInput('minHP', 'HP下限')}
        {numberInput('maxHP', 'HP上限')}
      </FormGroup>
      <FormGroup>
        {select('sizes', sizes, 'サイズ')}
        {select('elements', elements, '属性')}
        {select('races', races, '種族')}
      </FormGroup>
    </Form>
  );
});
