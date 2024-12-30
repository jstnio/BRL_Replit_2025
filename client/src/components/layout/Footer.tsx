import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">BRL Global</h3>
            <p className="text-muted-foreground text-sm">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.services.title')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services">
                  <a className="text-sm text-muted-foreground hover:text-primary">
                    {t('footer.services.oceanFreight')}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-sm text-muted-foreground hover:text-primary">
                    {t('footer.services.airFreight')}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-sm text-muted-foreground hover:text-primary">
                    {t('footer.services.groundTransport')}
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.company.title')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-sm text-muted-foreground hover:text-primary">
                    {t('footer.company.about')}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-sm text-muted-foreground hover:text-primary">
                    {t('footer.company.contact')}
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.contact.title')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t('footer.contact.address.line1')}</li>
              <li>{t('footer.contact.address.line2')}</li>
              <li>{t('footer.contact.address.line3')}</li>
              <li>{t('footer.contact.phone')}</li>
              <li>{t('footer.contact.email')}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}