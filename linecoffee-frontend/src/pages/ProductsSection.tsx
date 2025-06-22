import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrinHearts, faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid, faArrowRight, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';


function ProductSliderSection() {
    const { t } = useTranslation();
    const [activeIcons, setActiveIcons] = useState<{ [key: string]: boolean }>({});
    const [ratings, setRatings] = useState<{ [key: number]: number }>({});

    const toggleIcon = (key: string) => {
        setActiveIcons(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleRating = (productId: number, rating: number) => {
        setRatings(prev => ({
            ...prev,
            [productId]: rating
        }));
    };

    const products = [
        { id: 1, name: t("product.latte"), img: "/images/cup-20.webp", price: 60, priceBefore: 80 },
        { id: 2, name: t("product.espresso"), img: "/images/cup-20.webp", price: 40, priceBefore: 50 },
        { id: 3, name: t("product.mocha"), img: "/images/cup-20.webp", price: 55, priceBefore: 70 },
        { id: 4, name: t("product.macchiato"), img: "/images/cup-20.webp", price: 45, priceBefore: 60 },
        { id: 5, name: t("product.cappuccino"), img: "/images/cup-20.webp", price: 50, priceBefore: 65 },
        { id: 6, name: t("product.americano"), img: "/images/cup-20.webp", price: 38, priceBefore: 55 }
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <section id='products' className="py-5 bg-light">
            <div className="container-fluid">
                <h1>our products</h1>
                <div className="row g-0 align-items-center align-items-stretch justify-content-between">
                    {/* left image*/}
                    <div className="col-md-6 mb-4 mb-md-0">
                      <div className="leftImage">
                            <div className="hover-image-wrapper w-100">
                                <img src="/images/heroCoffe.jpg" className="img-fluid w-100 h-100 object-fit-cover" alt="promo" />
                            </div>
                      </div>
                    </div>

                    {/* right products*/}
                    <div className="col-md-6 px-4">
                        <div className="rightPro">
                            <h2 className="mb-3">{t("product.products_title")}</h2>
                            <p className="mb-3">{t("product.description")}</p>
                            

                            <Slider {...settings}>
                                {products.map((product) => (
                                    <div key={product.id} className="px-2">
                                        <div className="cardItem">
                                            <div className="cardImage">
                                                <img src={product.img} alt={product.name} className="w-100" />
                                                <div className="layer">
                                                    <FontAwesomeIcon
                                                        className={`icon mb-2 ${activeIcons[`heart${product.id}`] ? 'active-heart' : ''}`}
                                                     icon={faGrinHearts}
                                                        onClick={() => toggleIcon(`heart${product.id}`)}
                                                    />
                                                    <FontAwesomeIcon
                                                        className={`icon mb-2 ${activeIcons[`cart${product.id}`] ? 'active-other' : ''}`}
                                                        icon={faCartShopping}
                                                        onClick={() => toggleIcon(`cart${product.id}`)}
                                                    />
                                                    <FontAwesomeIcon
                                                        className={`icon ${activeIcons[`arrow${product.id}`] ? 'active-soc' : ''}`}
                                                        icon={faArrowRight}
                                                        onClick={() => toggleIcon(`arrow${product.id}`)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="cardBody mt-3 text-start">
                                                <h3 className="proName">{product.name}</h3>
                                                <div className="price">
                                                    <span>{t("product.price")} {product.price} {t("product.egp")}</span>
                                                    <del><span className='priceBefore'>{product.priceBefore} {t("product.egp")}</span></del>
                                                </div>
                                                <div className='starIcons mt-2'>
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <FontAwesomeIcon
                                                            key={star}
                                                            icon={star <= (ratings[product.id] || 0) ? faStarSolid : faStarRegular}
                                                            className='star me-1'
                                                            onClick={() => handleRating(product.id, star)}
                                                            style={{ color: star <= (ratings[product.id] || 0) ? '#f1c40f' : '#ccc', cursor: 'pointer' }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>

                        <div className="text-center mt-4">
                            <Link to="/products" className="btn btn-outline-dark">
                                {t("product.view_all")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}

export default ProductSliderSection;
