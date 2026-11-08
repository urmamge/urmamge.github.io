import { Anchor, Badge, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { mount } from './render';
import KofiButton from './KofiButton';
import Subpage from './Subpage';
import appClasses from './App.module.css';
import classes from './Subpage.module.css';

const chat = [
  'Tabs and splits like Chatterino. Each chat is as wide as Twitch’s own chat, and opening another one beside it widens the window instead of squashing them',
  'Read any Twitch or YouTube channel without signing in. Follow a YouTube channel by its @handle and Chat+ joins each new live stream by itself',
  'Combined tabs: your Twitch and YouTube chat in one feed, each message marked with the platform it came from',
  'Send to one platform or both at once. Replies only go to the platform of the message you’re replying to',
  'Moderate from the user card or the right-click menu: delete, timeouts, ban, unban, mod and VIP, plus /ban, /timeout and the other usual commands',
  '7TV, BTTV and FFZ emotes, badges, Super Chats, bits, subs, memberships and raids, highlights for your name, ignores, search, tab completion and chat logs',
];

const overlay = [
  'Copy one link into an OBS Browser Source and your combined chat is on stream',
  'Transparent, solid or bubble backgrounds, any Google font, text size, weight, colour and outline',
  'Platform icons (or your own), badges, emotes and timestamps, each on or off',
  'Messages that fade after a set time, a limit on how many are on screen, slide or fade animations',
  'Hide bots, !commands, links or blocked words, and highlighted cards for Super Chats, bits and subs',
  'Right-click a message in Chat+ and choose “Show on stream” to pin it big on the overlay',
  'Several overlay profiles, each with a live preview in Settings, plus custom CSS for anything else',
];

/** matthewhearst.com/apps/chatplus */
mount(
  <Subpage
    back={{ href: '/apps/', label: 'Back to apps' }}
    action={<KofiButton />}
    eyebrow="windows app"
    title="Chat+ with overlay integration"
    intro="A chat client for streamers. It puts your Twitch and YouTube chat in one window, and shows them on stream with a built-in OBS overlay."
  >
    <Stack gap={48}>
      <Group gap="sm">
        <Badge variant="outline" color="gray" size="lg" className={appClasses.label}>
          Coming soon
        </Badge>
        <Badge variant="outline" color="gray" size="lg" className={appClasses.label}>
          Windows 10 & 11
        </Badge>
      </Group>

      <div className={classes.panel}>
        <Title order={2} fz="h4" mb="md">
          Why I made it
        </Title>
        <Text c="dark.1" size="sm">
          I stream to Twitch and YouTube, and I like{' '}
          <Anchor href="https://chatterino.com" target="_blank" rel="noopener noreferrer" c="blush.4" inherit>
            Chatterino
          </Anchor>
          , but it only shows Twitch chat and has no overlay. Chat+ keeps what I like about Chatterino and adds YouTube, one feed for
          both chats, and an overlay so the combined chat can go on stream.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <div className={classes.panel}>
          <Title order={2} fz="h4" mb="md">
            The chat
          </Title>
          <Stack gap="sm">
            {chat.map((line) => (
              <Text key={line} c="dark.1" size="sm">
                {line}
              </Text>
            ))}
          </Stack>
        </div>
        <div className={classes.panel}>
          <Title order={2} fz="h4" mb="md">
            The overlay
          </Title>
          <Stack gap="sm">
            {overlay.map((line) => (
              <Text key={line} c="dark.1" size="sm">
                {line}
              </Text>
            ))}
          </Stack>
        </div>
      </SimpleGrid>

      <div className={classes.panel}>
        <Title order={2} fz="h4" mb="md">
          Your data
        </Title>
        <Text c="dark.1" size="sm">
          Chat+ runs on your PC. It talks straight to Twitch and YouTube, your logins stay in Windows Credential Manager, and nothing is sent to me:
          no accounts, analytics or ads. The overlay is only reachable from your own PC.
        </Text>
      </div>

      <Text c="dark.3" size="xs">
        Inspired by Chatterino. Chat+ isn’t affiliated with or endorsed by Chatterino, Twitch or YouTube. Chat+ uses YouTube API Services.{' '}
        <Anchor href="/apps/chatplus/privacy-policy/" c="dark.2" inherit>
          Privacy Policy
        </Anchor>{' '}
        ·{' '}
        <Anchor href="/apps/chatplus/terms-of-service/" c="dark.2" inherit>
          Terms of Service
        </Anchor>
      </Text>
    </Stack>
  </Subpage>,
);
