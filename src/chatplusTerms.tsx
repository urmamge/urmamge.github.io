import { List } from '@mantine/core';
import { mount } from './render';
import LegalPage, { LegalLink, LegalList, LegalSection, LegalText } from './LegalPage';
import { contactEmail } from './links';

/** matthewhearst.com/apps/chatplus/terms-of-service */
mount(
  <LegalPage
    back={{ href: '/apps/chatplus/', label: 'Back to Chat+' }}
    eyebrow="chat+"
    title="Terms of Service"
    updated="8 November 2026"
  >
    <LegalText>
      These terms cover your use of Chat+ (“the app”), which is made by urmamge Productions (Matthew Hearst). By using the app, you agree to them. If you
      don’t agree, please don’t use the app.
    </LegalText>

    <LegalSection heading="Twitch’s and YouTube’s rules still apply">
      <LegalText>
        Chat+ connects you to Twitch and YouTube, so you must also follow the{' '}
        <LegalLink href="https://www.twitch.tv/p/legal/terms-of-service/">Twitch Terms of Service</LegalLink>,{' '}
        <LegalLink href="https://safety.twitch.tv/s/article/Community-Guidelines">Twitch Community Guidelines</LegalLink> and{' '}
        <LegalLink href="https://www.youtube.com/t/terms">YouTube Terms of Service</LegalLink> when using it.
      </LegalText>
    </LegalSection>

    <LegalSection heading="Using the app">
      <LegalText>The app is free. Please don’t use it to:</LegalText>
      <LegalList>
        <List.Item>spam, harass anyone, or break Twitch’s or YouTube’s rules,</List.Item>
        <List.Item>get around a ban, timeout or a channel’s chat settings, or</List.Item>
        <List.Item>overload, abuse or get around the limits of Twitch’s or YouTube’s services.</List.Item>
      </LegalList>
      <LegalText>
        You’re responsible for the messages you send and the moderation actions you take with the app, just as if you’d done them on Twitch or YouTube
        directly.
      </LegalText>
    </LegalSection>

    <LegalSection heading="No guarantees">
      <LegalText>
        The app is provided “as is”. Twitch and YouTube can change their services at any time, so parts of the app may stop working until it’s updated.
        It may change or stop being updated at any time.
      </LegalText>
    </LegalSection>

    <LegalSection heading="Liability">
      <LegalText>
        As far as the law allows, urmamge Productions isn’t liable for any loss or damage that comes from using, or not being able to use, the app.
      </LegalText>
    </LegalSection>

    <LegalSection heading="Not affiliated">
      <LegalText>
        Chat+ is inspired by Chatterino but isn’t affiliated with or endorsed by the Chatterino team, Twitch or YouTube. Twitch and YouTube are trademarks of
        their owners.
      </LegalText>
    </LegalSection>

    <LegalSection heading="Your data">
      <LegalText>
        How the app handles information is explained in the <LegalLink href="/apps/chatplus/privacy-policy/">privacy policy</LegalLink>.
      </LegalText>
    </LegalSection>

    <LegalSection heading="Changes to these terms">
      <LegalText>
        If these terms change, the new version will be posted on this page with a new “Last updated” date. Using the app after that means you accept the
        new terms.
      </LegalText>
    </LegalSection>

    <LegalSection heading="Contact">
      <LegalText>
        Questions? Email <LegalLink href={`mailto:${contactEmail}`} />.
      </LegalText>
    </LegalSection>
  </LegalPage>,
);
