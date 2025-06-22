import { faFacebookF, faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope } from "@fortawesome/free-regular-svg-icons"
import { faEnvelopeCircleCheck, faLocationDot, faPhoneVolume } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


function Footer() {
  return (
    <>
    <footer>
      <div className="container-fluid">
        <h1>contact us</h1>
          <div className="row align-items-start footer-content">
            <div className="col-md-4 d-flex flex-column align-items-start ">
              <img className="logo" src="/public/images/cup-20.webp" alt="" />
            </div>
            <div className="col-md-4 d-flex flex-column align-items-start text-center">
              <div className="leftFooter">
                <h2 className="footer-title mb-4">our info</h2>
                <div className="cont-address">
                  <FontAwesomeIcon className="icon" icon={faLocationDot} />
                  <p className="ms-4">Lorem ipsum dolor sit amet.</p>
                </div>
                <div className="cont-phone">
                  <FontAwesomeIcon className="icon" icon={faPhoneVolume} />
                  <p className="ms-4">011455555555</p>
                </div>
                <div className="cont-email">
                  <FontAwesomeIcon className="icon" icon={faEnvelope} />
                  <p className="ms-4">slsabilkamal99@gmail.com</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 d-flex flex-column align-items-start">
              <div className="contact">
                <h2 className="footer-title mb-5">our social media</h2>
                <div className="social-icons">
                  <a href="http://"><FontAwesomeIcon className="icon" icon={faFacebookF} /></a>
                  <a href="http://"><FontAwesomeIcon className="icon" icon={faWhatsapp} /></a>
                  <a href="http://"><FontAwesomeIcon className="icon" icon={faEnvelopeCircleCheck} /></a>
                </div>
                
                
              </div>
            </div>
        </div>
      </div>
    </footer>
    </>
  )
}

export default Footer