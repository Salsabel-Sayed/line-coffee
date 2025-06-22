import { useTranslation } from 'react-i18next';

function CoinsSection() {
    const { t } = useTranslation();

    return (
        <section id='coinsSection' className="py-5 bg-dark text-white">
            <div className="coins">
                <div className="container">
                    <h1>how to get coins </h1>
                    <p>how to get coins and money back after buying our peoducts</p>
                    <div className="row gy-5  mt-4">
                        <div className="col-md-4 cardContent">
                            <div className="coinCard">
                                <div className="coinImg">
                                    <img src="/public/images/cup-20.webp" alt="" />
                                </div>
                                <div className="coinBody">
                                    <h3>{t("product.products_title")}</h3>
                                    <p className="mb-3">{t("product.description")}</p>
                                    <button className='btn btn-outline-dark'>{t("product.description")}</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 cardContent">
                            <div className="coinCard">
                                <div className="coinImg">
                                    <img src="/public/images/cup-20.webp" alt="" />
                                </div>
                                <div className="coinBody">
                                    <h3>{t("product.products_title")}</h3>
                                    <p className="mb-3">{t("product.description")}</p>
                                    <button className='btn btn-outline-dark'>{t("product.description")}</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 cardContent">
                            <div className="coinCard">
                                <div className="coinImg">
                                    <img src="/public/images/cup-20.webp" alt="" />
                                </div>
                                <div className="coinBody">
                                    <h3>{t("product.products_title")}</h3>
                                    <p className="mb-3">{t("product.description")}</p>
                                    <button className='btn btn-outline-dark'>{t("product.description")}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CoinsSection;
