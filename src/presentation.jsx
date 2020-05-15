/* eslint-disable import/no-webpack-loader-syntax */

// Import React
import React from 'react';

// Import Spectacle Core tags
import {
  Deck,
  Heading,
  Slide,
  Text,
  CodeSnippet,
  Image,
  AppearImage,
  AppearText,
} from './components';

// Import theme
import createTheme from 'spectacle/lib/themes/default';

// Require CSS
require('normalize.css');

const theme = createTheme(
  {
    primary: '#131226',
    secondary: '#F2E30C',
    tertiary: '#F2A30F',
    quaternary: '#F27B13',
    fifth: '#F24B0F',
  },
  {
    primary: 'Montserrat',
    secondary: 'Helvetica',
  },
  {
    margin: '10',
  },
);

const images = {
  gameLoop: require('./assets/gameLoop.png'),
  server: require('./assets/server.png'),
  sendState: require('./assets/sendState.png'),
  clientServer: require('./assets/clientServer.png'),
  webrtcClient: require('./assets/webrtcClient.png'),
};

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck
        transition={[]}
        theme={theme}>
        <Slide>
          <Heading>
            Real Time Multiplayer Web Games & WebRTC
          </Heading>
        </Slide>
        <Slide>
          <Heading>
            Why this topic?
          </Heading>
          <AppearText>
            Why not!
          </AppearText>
          <AppearText>
            I think this stuff is super cool and want to share it
          </AppearText>
          <AppearText>
            I've learned it along the way of making some moderately popular web games of my own
          </AppearText>
          <AppearText>
            Gaming has many extremely difficult and unique engineering problems
          </AppearText>
        </Slide>
        <Slide>
          <Text>
            Let's start by going over multiplayer game architectures
          </Text>
        </Slide>
        <Slide>
          <Heading>
            What goes into a game?
          </Heading>
          <AppearText>
            Let's start with a simple singleplayer game
          </AppearText>
        </Slide>
        <Slide>
          <Text>
            Minimal single-player game loop
          </Text>
          <Image width="50%" src={images.gameLoop}/>
          <AppearText>
            <CodeSnippet>processInputs()</CodeSnippet> reads client keyboard inputs
          </AppearText>
          <AppearText>
            <CodeSnippet>update()</CodeSnippet> processes the game logic
          </AppearText>
          <AppearText>
            <CodeSnippet>draw()</CodeSnippet> renders the game
          </AppearText>
          <AppearText>
            Run it 60 times a second and we've got a game!
          </AppearText>
        </Slide>
        <Slide>
        </Slide>
        <Slide>
          <Heading>
            Now to add multiplayer
          </Heading>
          <AppearText>
            We'll go with a normal client-server architecture
          </AppearText>
          <AppearText>
            Always remember the most important rule for secure multiplayer games
          </AppearText>
          <AppearText>
            <b>Never trust the client!</b>
          </AppearText>
          <AppearText>
            We'll need an "authoritative server"
          </AppearText>
        </Slide>
        <Slide>
          <Heading>
            Authoritative server
          </Heading>
          <AppearImage src={images.server} width="50%"/>
        </Slide>
        <Slide>
          <Heading>
            Let's look at <CodeSnippet>sendStateToClients()</CodeSnippet>
          </Heading>
          <AppearImage src={images.sendState} width="50%"/>
          <AppearText>
            We tell each client its entity id, and the game state
          </AppearText>
        </Slide>
        <Slide>
          <Heading>
            What about on the client side?
          </Heading>
          <AppearImage src={images.clientServer} width="50%"/>
        </Slide>
        <Slide>
          <Heading>
            So far, simple, but many issues
          </Heading>
          <AppearText>
            Any updates require a full round-trip to the server
          </AppearText>
          <AppearText>
            <b>That means input lag!</b>
          </AppearText>
          <AppearText>
            From another continent, you press a button, and might wait half a second for it to register
          </AppearText>
        </Slide>
        <Slide>
          <Text>For input lag, solutions must be customized to the game - mix together:</Text>
          <AppearText>Client-side prediction</AppearText>
          <AppearText>Lag compensation</AppearText>
          <AppearText>Server reconciliation</AppearText>
          <AppearText>We won't go into detail on these, as they are complicated</AppearText>
          <AppearText>These are key to a smooth feeling fast paced game</AppearText>
        </Slide>
        <Slide>
          <Heading>
            Not perfect solutions!
          </Heading>
          <AppearText>They're hacks that try to hide the lag from the player</AppearText>
          <AppearText>If lag is bad enough, it will still feel terrible</AppearText>
          <AppearText>How can we make that bad lag less likely for players?</AppearText>
          <AppearText>Almost ready to introduce WebRTC...</AppearText>
          <AppearText>But first - a history of UDP vs TCP for games</AppearText>
        </Slide>
        <Slide>
          <Heading>
            UDP vs TCP for gaming
          </Heading>
          <AppearText>
            TCP: Reliable, ordered message stream
          </AppearText>
          <AppearText>
            Dropped packets are retried, newer packets are delayed until old ones go through
          </AppearText>
          <AppearText>
            This is great for many things on the web, but retrying & delaying makes lag worse!
          </AppearText>
          <AppearText>
            Playing on a poor WiFi connnection will feel awful because of dropped packets delaying all data
          </AppearText>
        </Slide>
        <Slide>
          <Heading>
            UDP vs TCP for gaming
          </Heading>
          <AppearText>
            UDP: Unreliable, unordered messages
          </AppearText>
          <AppearText>
            Dropped packets are not retried
          </AppearText>
          <AppearText>
            New messages may arrive before old messages
          </AppearText>
          <AppearText>
            All the safety of TCP is gone - but so are the slowdowns
          </AppearText>
        </Slide>
        <Slide>
          <Heading>
            UDP vs TCP for gaming
          </Heading>
          <AppearText>
            Due to TCP's non time-critical nature, UDP is preferred for fast paced multiplayer games
          </AppearText>
          <AppearText>
            Still need to ensure data is not lost
          </AppearText>
          <AppearText>
            Message reliability needs to be built ad-hoc
          </AppearText>
          <AppearText>
            Clients and servers exchange acknowleded recent message ids
          </AppearText>
          <AppearText>
            Messages unacknowleded within certain time are resent if necessary
          </AppearText>
          <AppearText>
            Client continues to get other data when there was a dropped packet!
          </AppearText>
        </Slide>
        <Slide>
          <Text>
            Using UDP = much more consistent networking experience
          </Text>
        </Slide>
        <Slide>
          <Heading>
            Problem solved? Not for browser games!
          </Heading>
          <AppearText>
            Unfortunately... <i>browsers just can't do UDP</i>
          </AppearText>
          <AppearText>
            Browsers were built on top of HTTP, which needs reliable streams
          </AppearText>
          <AppearText>
            Is all hope for real-time web games lost?
          </AppearText>
        </Slide>
        <Slide>
          <Heading>
            In comes WebRTC (Web Real-Time Communication)
          </Heading>
          <AppearText>
            Supports streaming audio and video & direct peer-to-peer connections
          </AppearText>
          <AppearText>
            Replacement for the plugins and custom native apps (remember Flash? Silverlight?)
          </AppearText>
          <AppearText>
            Widely supported in all major browsers
          </AppearText>
          <AppearText>
            Spec is very complicated - client-server game with a data stream is not the intended use case
          </AppearText>
          <AppearText>
            A less known feature of WebRTC: Arbitrary binary data channels
          </AppearText>
          <AppearText>
            That sounds perfect - let's try to use it!
          </AppearText>
        </Slide>
        <Slide>
          <Heading>
            Will this work? Does WebRTC use UDP?
          </Heading>
          <AppearText>
            No, but it uses something we can make work just like it: <b>STCP</b>
          </AppearText>
          <AppearText>
            STCP (Scalable TCP) is configurable
          </AppearText>
          <AppearText>
            We can set <CodeSnippet>retries = 0</CodeSnippet> and <CodeSnippet>ordered = false</CodeSnippet>
          </AppearText>
          <AppearText>
            Just like UDP!
          </AppearText>
        </Slide>
        <Slide>
          <Heading>
            But, isn't WebRTC hard to use?
          </Heading>
          <AppearText>
            <b>Yes</b>
          </AppearText>
          <AppearText>
            Much harder to get up and running than websockets
          </AppearText>
          <AppearText>
            Browser debug tools are awful compared to websockets
          </AppearText>
          <AppearText>
            But it can be done!
          </AppearText>
          <AppearText>
            Libraries like Node's <CodeSnippet>node-webrtc</CodeSnippet> and Rust's <CodeSnippet>webrtc-unreliable</CodeSnippet> exist
          </AppearText>
          <AppearText>
            Server acts like a peer that the clients connect to
          </AppearText>
        </Slide>
        <Slide>
          <Heading>
            WebRTC code on the client
          </Heading>
          <AppearImage src={images.webrtcClient}/>
        </Slide>
        <Slide>
          <Heading>
            STUN? ICE?! What's all this?
          </Heading>
          <AppearText>
            STUN (Session Traversal Utilities for NAT) is a server that helps establish the connection with the peer
          </AppearText>
          <AppearText>
            You can use a public STUN server, or run your lightweight STUN server easily
          </AppearText>
          <AppearText>
            ICE (Interactive Connectivity Establishment) is the protocol to establish the connection
          </AppearText>
        </Slide>
        <Slide>
          <Heading>
            So what was all that?
          </Heading>
          <AppearText>
            We use a normal HTTP endpoint to expose the server as the ICE candidate
          </AppearText>
          <AppearText>
            Let's look again
          </AppearText>
        </Slide>
        <Slide>
          <Heading>
            WebRTC code on the client
          </Heading>
          <AppearImage src={images.webrtcClient}/>
        </Slide>
        <Slide>
          <Text>
            On the server, those libraries do the heavy lifting
          </Text>
          <AppearText>
            We can just listen almost as if using a websocket!
          </AppearText>
        </Slide>
        <Slide>
          <Heading>
            That's all!
          </Heading>
          <AppearText>
            That's the basics of WebRTC, and how it may be the future of real-time browser games
          </AppearText>
          <AppearText>
            Thanks for listening!
          </AppearText>
        </Slide>
      </Deck>
    );
  }
}
