import React from 'react';
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
  TableHeaderCell,
} from 'semantic-ui-react';
import formatter from 'format-number';
import _ from 'lodash';
import Monster from '../types/Monster';
import Options from '../types/Options';
import { monsters } from '../data/monsters.json';

type Item = Monster & {
  expCorrection: number | null;
  correctedJobExp: number | null;
  correctedBaseExp: number | null;
};

const formatInteger = formatter({
  round: 0,
});

const MonsterTableRow = React.memo(function MonsterTableRow({
  monster,
  n,
}: {
  monster: Item;
  n: number;
}) {
  const {
    name,
    base,
    expCorrection,
    correctedBaseExp,
    correctedJobExp,
  } = monster;

  return (
    <TableRow>
      <TableCell textAlign="right">{n + 1}</TableCell>
      <TableCell>
        {name.ja} -{name.cn1}
      </TableCell>
      <TableCell textAlign="right">
        {base.レベル && formatInteger(base.レベル)}
      </TableCell>
      <TableCell textAlign="right">
        {expCorrection && `${formatInteger(expCorrection * -100)}%`}
      </TableCell>
      <TableCell textAlign="right">
        {correctedBaseExp && formatInteger(correctedBaseExp)}
      </TableCell>
      <TableCell textAlign="right">
        {correctedJobExp && formatInteger(correctedJobExp)}
      </TableCell>
      <TableCell>{monster.base.サイズ}</TableCell>
      <TableCell>{monster.base.属性}</TableCell>
      <TableCell>{monster.base.種族}</TableCell>
    </TableRow>
  );
});

export interface MonsterTableProps {
  options: Options;
}

interface State {
  sort: {
    path: string;
    direction: 'ascending' | 'descending';
  };
}

function getExpCollection(baseLevel: number, targetLevel: number): number {
  const diff = targetLevel - baseLevel;
  if (diff > 20) {
    return 0.5;
  } else if (diff > 10) {
    return 0.2;
  } else if (diff < -30) {
    return 0.9;
  } else if (diff < -25) {
    return 0.8;
  } else if (diff < -20) {
    return 0.6;
  } else if (diff < -15) {
    return 0.4;
  } else if (diff < -10) {
    return 0.2;
  }
  return 0;
}

const headers = [
  { text: '名前', path: 'name.ja' },
  { text: 'レベル', path: 'base.レベル' },
  { text: 'レベル差補正', path: 'expCorrection' },
  { text: 'Base経験値（補）', path: 'correctedBaseExp' },
  { text: 'Job経験値（補）', path: 'correctedJobExp' },
  { text: 'サイズ', path: 'base.サイズ' },
  { text: '属性', path: 'base.属性' },
  { text: '種族', path: 'base.種族' },
];

export default class MonsterTable extends React.Component<
  MonsterTableProps,
  State
> {
  constructor(props: MonsterTableProps) {
    super(props);

    this.state = {
      sort: {
        path: 'base.レベル',
        direction: 'ascending',
      },
    };
  }

  get items(): Item[] {
    const {
      baseLevel,
      minHP,
      maxHP,
      sizes,
      races,
      elements,
    } = this.props.options;
    const { sort } = this.state;

    const items = monsters
      .filter(monster => {
        if (minHP && (!monster.status.HP || monster.status.HP < minHP)) {
          return false;
        }
        if (maxHP && (!monster.status.HP || monster.status.HP > maxHP)) {
          return false;
        }
        if (
          sizes &&
          (!monster.base.サイズ || sizes.indexOf(monster.base.サイズ) < 0)
        ) {
          return false;
        }
        if (
          races &&
          (!monster.base.種族 || races.indexOf(monster.base.種族) < 0)
        ) {
          return false;
        }
        if (
          elements &&
          (!monster.base.属性 || elements.indexOf(monster.base.属性) < 0)
        ) {
          return false;
        }

        return true;
      })
      .map(monster => {
        const {
          レベル: level,
          ベース経験値: baseExp,
          ジョブ経験値: jobExp,
        } = monster.base;
        const expCorrection = level && getExpCollection(baseLevel, level);
        const correctedBaseExp =
          expCorrection !== null && baseExp
            ? baseExp * (1 - expCorrection)
            : null;
        const correctedJobExp =
          expCorrection !== null && jobExp
            ? jobExp * (1 - expCorrection)
            : null;

        return {
          ...monster,
          expCorrection,
          correctedBaseExp,
          correctedJobExp,
        };
      });

    const sorted = _.sortBy(items, a => _.get(a, sort.path));

    if (sort.direction === 'ascending') return sorted;

    const reversed = sorted.reverse();
    const i = reversed.findIndex(a => _.get(a, sort.path));
    if (i <= 0) return reversed;

    return [...reversed.slice(i), ...reversed.slice(0, i)];
  }

  render(): JSX.Element {
    const headerCells = headers.map(({ text, path }, i) => {
      const sorted =
        this.state.sort.path === path ? this.state.sort.direction : undefined;
      const onClick = (): void => {
        this.setState(({ sort }) => ({
          sort: {
            path,
            direction:
              sort.path === path && sort.direction === 'ascending'
                ? 'descending'
                : 'ascending',
          },
        }));
      };

      return (
        <TableHeaderCell key={i} sorted={sorted} onClick={onClick}>
          {text}
        </TableHeaderCell>
      );
    });

    const rows = this.items.map((monster, n) => (
      <MonsterTableRow key={monster.id} monster={monster} n={n} />
    ));

    return (
      <Table sortable>
        <TableHeader>
          <TableRow>
            <TableHeaderCell />
            {headerCells}
          </TableRow>
        </TableHeader>
        <TableBody>{rows}</TableBody>
      </Table>
    );
  }
}
