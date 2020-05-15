import React from "react";

import {
  Appear as SpectacleAppear,
  Deck as SpectacleDeck,
  Heading as SpectacleHeading,
  ListItem as SpectacleListItem,
  List as SpectacleList,
  Slide as SpectacleSlide,
  Text as SpectalceText,
  Image as SpectacleImage,
} from 'spectacle';

const normalMargin = '25';

// Rexported with defaults
export class Appear extends React.Component {
  render() {
    return (
      <SpectacleAppear {...this.props}>
        {this.props.children}
      </SpectacleAppear>
    );
  }
}

export class Deck extends React.Component {
  render() {
    return (
      <SpectacleDeck {...this.props}>
        {this.props.children}
      </SpectacleDeck>
    );
  }
}

export class Heading extends React.Component {
  render() {
    return (
      <SpectacleHeading size={5} margin={normalMargin} textColor='tertiary' {...this.props}>
        {this.props.children}
      </SpectacleHeading>
    );
  }
}

export class ListItem extends React.Component {
  render() {
    return (
      <SpectacleListItem margin={normalMargin} textColor='quaternary' {...this.props}>
        {this.props.children}
      </SpectacleListItem>
    );
  }
}

export class List extends React.Component {
  render() {
    return (
      <SpectacleList margin={normalMargin} {...this.props}>
        {this.props.children}
      </SpectacleList>
    );
  }
}

export class Slide extends React.Component {
  render() {
    return (
      <SpectacleSlide style={{height: '100%'}} {...this.props}>
        {this.props.children}
      </SpectacleSlide>
    );
  }
}

export class Text extends React.Component {
  render() {
    return (
      <SpectalceText margin={normalMargin} textColor="quaternary" textAlign="left" {...this.props}>
        {this.props.children}
      </SpectalceText>
    );
  }
}

export class Image extends React.Component {
  render() {
    return (
      <SpectacleImage {...this.props}>
        {this.props.children}
      </SpectacleImage>
    );
  }
}

// New components.

export class CodeSnippet extends React.Component {
  render() {
    return <span style={{fontFamily: 'monospace', color: '#ee8613'}}>{this.props.children}</span>;
  }
}

export class AppearList extends React.Component {
  render() {
    let children;
    if (this.props.children.map === undefined) {
      children = [this.props.children];
    } else {
      children = this.props.children;
    }
    return (
      <List {...this.props}>
        {children.map((e, i) => {
          return (
            <Appear key={i}>
              {e}
            </Appear>
          );
        })}
      </List>
    );
  }
}

export class AppearText extends React.Component {
  render() {
    return (
      <Appear>
        <Text margin={normalMargin} {...this.props} textAlign="left">
          {this.props.children}
        </Text>
      </Appear>
    );
  }
}

export class AppearImage extends React.Component {
  render() {
    return (
      <Appear>
        <Image {...this.props}>
          {this.props.children}
        </Image>
      </Appear>
    );
  }
}
