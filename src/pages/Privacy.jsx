import { useLanguage } from '../context/LanguageContext';

export default function Privacy() {
  const { lang } = useLanguage();

  if (lang === 'en') {
    return (
      <main>
        <div className="page-hero">
          <div className="wrap">
            <h1>Privacy Policy</h1>
            <p>Last updated: August 2026</p>
          </div>
        </div>

        <section>
          <div className="wrap legal-content">
            <h3>1. Information We Collect</h3>
            <p>
              We only collect the information necessary to provide the service and activate your subscription: your
              name, a contact method (email, WhatsApp number, or Telegram username), and any messages you send us
              through the contact form or live chat.
            </p>

            <h3>2. How We Use Your Information</h3>
            <p>
              Your information is used exclusively to activate your subscription, respond to your questions, and
              improve the quality of the service. We do not sell or share your data with any third party for
              marketing purposes.
            </p>

            <h3>3. Data Protection</h3>
            <p>
              Your data is stored on secure servers, and only the authorized support team can access it to help with
              your subscription.
            </p>

            <h3>4. Cookies</h3>
            <p>
              The site uses simple local storage in your browser (such as remembering that you dismissed a certain
              notice) to improve your experience, without ad tracking or sharing this data with any outside party.
            </p>

            <h3>5. Your Right to Delete Your Data</h3>
            <p>
              You can request the deletion of your account-related data at any time by contacting us directly, and
              the request will be carried out within a reasonable period.
            </p>

            <h3>6. Contact</h3>
            <p>
              For any question about the privacy of your data, reach us through the "Contact Us" page.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <div className="page-hero">
        <div className="wrap">
          <h1>سياسة الخصوصية</h1>
          <p>آخر تحديث: أغسطس 2026</p>
        </div>
      </div>

      <section>
        <div className="wrap legal-content">
          <h3>١. المعلومات التي نجمعها</h3>
          <p>
            نجمع فقط المعلومات الضرورية لتقديم الخدمة وتفعيل اشتراكك: الاسم، وسيلة تواصل (بريد إلكتروني أو رقم
            واتساب أو يوزر تيليجرام)، وأي رسائل تُرسلها لنا عبر نموذج التواصل أو الدردشة المباشرة.
          </p>

          <h3>٢. كيف نستخدم معلوماتك</h3>
          <p>
            تُستخدم معلوماتك حصراً لتفعيل اشتراكك، والرد على استفساراتك، وتحسين جودة الخدمة. لا نبيع ولا نشارك
            بياناتك مع أي طرف ثالث لأغراض تسويقية.
          </p>

          <h3>٣. حماية البيانات</h3>
          <p>
            تُخزَّن بياناتك على خوادم آمنة، ولا يطّلع عليها إلا فريق الدعم المخوّل لمساعدتك في اشتراكك.
          </p>

          <h3>٤. ملفات تعريف الارتباط (Cookies)</h3>
          <p>
            يستخدم الموقع تخزيناً محلياً بسيطاً بمتصفحك (مثل تذكّر إغلاقك لإعلان معيّن) لتحسين تجربتك، دون تتبّع
            إعلاني أو مشاركة هذه البيانات مع أي جهة خارجية.
          </p>

          <h3>٥. حقك بحذف بياناتك</h3>
          <p>
            يمكنك بأي وقت طلب حذف بياناتك المرتبطة بحسابك بالتواصل معنا مباشرة، وسيتم تنفيذ الطلب خلال مدة معقولة.
          </p>

          <h3>٦. التواصل</h3>
          <p>
            لأي استفسار بخصوص خصوصية بياناتك، تواصل معنا عبر صفحة "تواصل معنا".
          </p>
        </div>
      </section>
    </main>
  );
}
