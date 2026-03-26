import { Body, Button, Container, Head, Html, Link, Preview, Section, Text } from "@react-email/components";
import { siteConfig } from "@/shared/config/site";
import { emailContent, emailStyles } from "./email.styles";

interface DeleteAccountEmailProps {
  name: string;
  url: string;
}

export const DeleteAccountEmail = ({ name, url }: DeleteAccountEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirm your account deletion</Preview>
    <Body style={emailStyles.body}>
      <Container style={emailStyles.container}>
        <Section>
          <Text style={emailStyles.heading}>Confirm Account Deletion</Text>
          <Text style={emailStyles.text}>{emailContent.greeting(name)}</Text>
          <Text style={emailStyles.text}>
            We're sorry to see you go! Please confirm your account deletion by clicking the button below:
          </Text>
          <Button href={url} style={emailStyles.errorButton}>
            Confirm Deletion
          </Button>
          <Text style={emailStyles.mutedText}>{emailContent.securityNotice()}</Text>
          <Text style={emailStyles.mutedText}>{emailContent.linkExpiry()}</Text>
          <Text style={emailStyles.text}>{emailContent.signOff()}</Text>
        </Section>

        <Section style={emailStyles.footer}>
          <Text style={emailStyles.mutedText}>{siteConfig.email.footer.company}</Text>
          <Text style={emailStyles.mutedText}>
            {siteConfig.contact.address.line1}, {siteConfig.contact.address.city}, {siteConfig.contact.address.state}{" "}
            {siteConfig.contact.address.postalCode}
          </Text>
          <Text style={emailStyles.mutedText}>
            <Link href={siteConfig.urls.privacy} style={emailStyles.footerLink}>
              {siteConfig.email.footer.privacy}
            </Link>
            {" • "}
            <Link href={siteConfig.urls.terms} style={emailStyles.footerLink}>
              {siteConfig.email.footer.terms}
            </Link>
          </Text>
          <Text style={emailStyles.mutedText}>{emailContent.supportInfo()}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
