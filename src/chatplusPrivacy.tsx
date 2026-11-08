import { List } from '@mantine/core';
import { mount } from './render';
import LegalPage, { LegalLink, LegalList, LegalSection, LegalText } from './LegalPage';
import { contactEmail } from './links';

const email = <LegalLink href={`mailto:${contactEmail}`} />;

/** matthewhearst.com/apps/chatplus/privacy-policy */
mount(
  <LegalPage
    back={{ href: '/apps/chatplus/', label: 'Back to Chat+' }}
    eyebrow="chat+"
    title="Privacy Policy"
    updated="8 November 2026"
  >
    <LegalText>
      This policy explains what information Chat+ (“the app”) uses and what happens to it. Chat+ is made by urmamge Productions (Matthew Hearst). If you
      have a question, email {email}.
    </LegalText>

    <LegalSection heading="The short version">
      <LegalText>
        Chat+ runs on your own PC. It connects straight to Twitch and YouTube for you, keeps everything it saves on your PC, and never sends anything to
        me. There are no accounts, analytics, tracking or ads.
      </LegalText>
    </LegalSection>

    <LegalSection heading="Reading chat">
      <LegalText>
        To show a channel’s chat, Chat+ asks Twitch or YouTube for that channel’s public chat, the same chat anyone can see on their website. This
        doesn’t need you to sign in. It also loads, using the channel’s name or ID:
      </LegalText>
      <LegalList>
        <List.Item>emotes from 7TV, BetterTTV and FrankerFaceZ, and</List.Item>
        <List.Item>a Twitch channel’s recent messages from the recent-messages service (recent-messages.robotty.de), so chat isn’t empty when you open it.</List.Item>
      </LegalList>
      <LegalText>Those services see the channel name and your IP address, as any website does. They don’t get anything about your accounts.</LegalText>
    </LegalSection>

    <LegalSection heading="Signing in">
      <LegalText>
        Signing in is optional and only needed to send messages or moderate. When you sign in to Twitch or YouTube, you approve Chat+ on Twitch’s or
        Google’s own page, and they give Chat+ a login token.
      </LegalText>
      <LegalList>
        <List.Item>The token is stored in Windows Credential Manager on your PC, never in a file or anywhere else.</List.Item>
        <List.Item>
          Chat+ uses it only to do what you ask: send your messages, carry out your moderation actions, and show your account name and other users’
          public profile details (like their profile picture and account age) on user cards.
        </List.Item>
        <List.Item>The token and anything Chat+ gets with it are never sent to me or anyone else.</List.Item>
      </LegalList>
    </LegalSection>

    <LegalSection heading="YouTube and Google">
      <LegalText>
        Chat+ uses YouTube API Services. By signing in to YouTube in Chat+, you agree to the{' '}
        <LegalLink href="https://www.youtube.com/t/terms">YouTube Terms of Service</LegalLink>, and Google’s{' '}
        <LegalLink href="https://policies.google.com/privacy">Privacy Policy</LegalLink> covers what Google does with your information.
      </LegalText>
      <LegalText>
        With your permission, Chat+ uses your YouTube account to find your channel name, find a live stream’s chat, send chat messages, and delete
        messages, time out, ban or add moderators in live chats you moderate. It doesn’t read your videos, comments, subscriptions or anything else.
      </LegalText>
      <LegalText>
        Chat+’s use and transfer of information received from Google APIs follows the{' '}
        <LegalLink href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</LegalLink>, including
        the Limited Use requirements. It isn’t used for ads, sold, or shared with anyone.
      </LegalText>
      <LegalText>
        You can remove Chat+’s access at any time from your Google account’s{' '}
        <LegalLink href="https://myaccount.google.com/connections">third-party connections</LegalLink> page.
      </LegalText>
    </LegalSection>

    <LegalSection heading="Twitch">
      <LegalText>
        Twitch’s <LegalLink href="https://www.twitch.tv/p/legal/privacy-notice/">Privacy Notice</LegalLink> covers what Twitch does with your
        information. You can remove Chat+’s access from Twitch’s <LegalLink href="https://www.twitch.tv/settings/connections">Connections</LegalLink>{' '}
        settings.
      </LegalText>
    </LegalSection>

    <LegalSection heading="What’s saved on your PC">
      <LegalList>
        <List.Item>Your settings: tabs, channels, highlights, ignores and overlay profiles.</List.Item>
        <List.Item>Chat logs of the channels you open, if “Save chat logs” is on (it can be turned off in Settings).</List.Item>
        <List.Item>Your login tokens, in Windows Credential Manager.</List.Item>
      </LegalList>
      <LegalText>
        The OBS overlay is served by Chat+ on your PC and can only be reached from your PC. Nothing on this list ever leaves your PC.
      </LegalText>
    </LegalSection>

    <LegalSection heading="Deleting your data">
      <LegalList>
        <List.Item>Sign out in Settings › Accounts to delete a login token.</List.Item>
        <List.Item>Use “Open logs folder” in Settings › General to delete chat logs.</List.Item>
        <List.Item>Uninstall Chat+ and delete the %APPDATA%\com.urmamge.chatplus folder to remove everything else.</List.Item>
      </LegalList>
      <LegalText>I don’t hold any of your data, so there’s nothing for me to delete, but you’re welcome to email {email} with questions.</LegalText>
    </LegalSection>

    <LegalSection heading="Age">
      <LegalText>You need to be old enough to use Twitch and YouTube to use Chat+. That’s at least 13, or older in some countries.</LegalText>
    </LegalSection>

    <LegalSection heading="Changes to this policy">
      <LegalText>If this policy changes, the new version will be posted on this page with a new “Last updated” date.</LegalText>
    </LegalSection>
  </LegalPage>,
);
