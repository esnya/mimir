import React from 'react';
import { Container, Segment, Sticky } from 'semantic-ui-react';
import MonsterTable from '../components/MonsterTable';
import OptionsForm from '../components/OptionsForm';
import Options from '../types/Options.js';

interface State {
  options: Options;
}

export default class Home extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      options: { baseLevel: 99 },
    };
  }

  contextRef = React.createRef<HTMLDivElement>();

  render(): JSX.Element {
    return (
      <div ref={this.contextRef}>
        <Container>
          <Sticky context={this.contextRef}>
            <Segment>
              <OptionsForm
                options={this.state.options}
                onChange={(value): void => {
                  this.setState(({ options }) => ({
                    options: { ...options, ...value },
                  }));
                }}
              />
            </Segment>
          </Sticky>
          <MonsterTable options={this.state.options} />
        </Container>
      </div>
    );
  }
}
