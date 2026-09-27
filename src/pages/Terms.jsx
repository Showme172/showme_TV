import { useLanguage } from '../context/LanguageContext';

export default function Terms() {
  const { lang } = useLanguage();

  if (lang === 'en') {
    return (
      <main>
        <div className="page-hero">
          <div className="wrap">
            <h1>Terms of Service</h1>
            <p>Last updated: August 2026</p>
          </div>
        </div>

        <section>
          <div className="wrap legal-content">
            <h3>1. Nature of the Service</h3>
            <p>
              Showme TV is a platform offering a subscription-based IPTV streaming service, including live channels
              and an on-demand movie and series library. Your subscription grants personal use of the service only,
              and it may not be resold or shared commercially without prior permission.
            </p>

            <h3>2. Subscription and Payment</h3>
            <p>
              Prices shown on the site are final and clear, with no hidden fees. Your subscription starts as soon as
              payment is confirmed, and your activation code and login details are sent within minutes of completing
              the transaction.
            </p>

            <h3>3. Acceptable Use</h3>
            <p>
              The subscriber agrees not to use the account for any unlawful purpose, and not to attempt to
              redistribute login details to other parties. Any violation may result in the account being suspended
              without refund.
            </p>

            <h3>4. Service Availability</h3>
            <p>
              We work to keep streaming stable around the clock, but temporary interruptions may occur due to
              technical reasons beyond our control (maintenance, internet provider outages, or force majeure). We
              work to restore the service as quickly as possible in such cases.
            </p>

            <h3>5. Changes to These Terms</h3>
            <p>
              We reserve the right to modify these terms at any time, and any update will be posted on this page.
            </p>

            <h3>6. Contact</h3>
            <p>
              For any question about these terms, reach us through the "Contact Us" page.
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
          <h1>شروط الخدمة</h1>
          <p>آخر تحديث: أغسطس 2026</p>
        </div>
      </div>

      <section>
        <div className="wrap legal-content">
          <h3>١. طبيعة الخدمة</h3>
          <p>
            Showme TV منصة تقدّم خدمة بث IPTV عبر الاشتراك، وتشمل قنوات مباشرة ومكتبة أفلام ومسلسلات عند الطلب.
            الاشتراك يمنحك حق الاستخدام الشخصي للخدمة فقط، ولا يجوز إعادة بيعها أو مشاركتها تجارياً دون إذن مسبق.
          </p>

          <h3>٢. الاشتراك والدفع</h3>
          <p>
            الأسعار المعروضة بالموقع نهائية وواضحة دون رسوم خفية. يبدأ الاشتراك فور تأكيد الدفع، ويُرسل كود التفعيل
            وبيانات الدخول خلال دقائق من إتمام العملية.
          </p>

          <h3>٣. الاستخدام المقبول</h3>
          <p>
            يلتزم المشترك بعدم استخدام الحساب لأي غرض غير قانوني، وعدم محاولة إعادة توزيع بيانات الدخول لأطراف أخرى.
            أي استخدام مخالف قد يؤدي لإيقاف الحساب دون استرجاع.
          </p>

          <h3>٤. توفر الخدمة</h3>
          <p>
            نسعى لضمان استقرار البث على مدار الساعة، لكن قد تحدث انقطاعات مؤقتة لأسباب فنية خارجة عن إرادتنا
            (صيانة، أعطال مزودي الإنترنت، أو ظروف قاهرة). نعمل على استعادة الخدمة بأسرع وقت ممكن في هذه الحالات.
          </p>

          <h3>٥. التعديلات على الشروط</h3>
          <p>
            نحتفظ بالحق بتعديل هذه الشروط في أي وقت، وسيتم نشر أي تحديث على هذه الصفحة.
          </p>

          <h3>٦. التواصل</h3>
          <p>
            لأي استفسار بخصوص هذه الشروط، تواصل معنا عبر صفحة "تواصل معنا".
          </p>
        </div>
      </section>
    </main>
  );
}
