import React from "react";
import "./errors.css";

export default function NotFound() {
  return (
    <>
      <section className="page_404">
        <div className="container">
          <div className="ev fouro-four-title">
            <h1>404 Page Not Found</h1>
          </div>         
            <div className="ev-notf ">
              <p>The page you are looking for is not available!</p>
            </div>

            <div className="ev-notf" >
            <img src="https://images.unsplash.com/photo-1545575439-3261931f52f1?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGN5Y2xpbmd8ZW58MHx8MHx8fDA%3D" />
            </div>
            
            <div className="ev-notf">
            <h3>
              {" "}
              <a href="/">Come cycling with us! </a>
            </h3>
            </div>
          </div>
        
      </section>
    </>
  );
}
