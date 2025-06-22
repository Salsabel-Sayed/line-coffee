

function About() {
  return (
    <>
      <section id="about">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="leftSide">
                <div className="headLine">
                  <div className="line"></div>
                  <h2>about our company</h2>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, explicabo.</p>
                  <button>view our work</button>
                </div>
                
              </div>
            </div>
            <div className="col-md-6">
              <div className="rightSide">
                <h3>what we do</h3>
                <div className="work">
                  <div className="leftImg">
                    <img src="/public/images/heroCoffe.jpg" alt="" />
                  </div>
                  <div className="rightWork ms-4 mb-4">
                    <h4>building coffee</h4>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam voluptatibus reiciendis, consequuntur eius delectus pariatur?
                    </p>                    
                  </div>
                </div>
                <div className="work">
                  <div className="leftImg">
                    <img src="/public/images/heroCoffe.jpg" alt="" />
                  </div>
                  <div className="rightWork mb-4 ms-4">
                    <h4>building coffee</h4>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam voluptatibus reiciendis, consequuntur eius delectus pariatur?
                    </p>
                  </div>
                </div>
                <div className="work">
                  <div className="leftImg">
                    <img src="/public/images/heroCoffe.jpg" alt="" />
                  </div>
                  <div className="rightWork mb-4 ms-4">
                    <h4>building coffee</h4>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam voluptatibus reiciendis, consequuntur eius delectus pariatur?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About