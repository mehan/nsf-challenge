import React from 'react';
import classnames from "classnames";
import StickyContainer from './sticky-container.js';

var MenuLink = React.createClass({
  onClick: function() {
    this.props.activate(this.props.item);
  },
  render: function() {
    var className = classnames(`menu-link`, {
      "active": this.props.active === this.props.item
    });

    return (
      <a className={className} onClick={this.onClick} href={this.props.href}>{this.props.children}</a>
    );
  }
});

var MenuLinks = React.createClass({
  getInitialState: function() {
    var links = [].slice.call(document.querySelectorAll(`.nav-anchor`));
    var active = window.location.hash.replace(`#`, ``) || ``;

    return {active, links};
  },
  componentDidMount: function() {
    document.addEventListener(`scroll`, this.onScroll);
  },
  componentWillUnmount: function() {
    document.removeEventListener(`scroll`, this.onScroll);
  },
  onScroll: function() {
    var links = this.state.links || [];
    var hash = window.location.hash.replace(`#`, ``);
    var active = ``;
    var scrollY = window.scrollY;

    if (links[0]) {
      active = links[0].getAttribute(`id`);
    }

    // If we have no hash, we should set it to the top nav.
    // We can stop checking.
    if (hash) {

      // Check to see which is the current nav item.
      links.forEach((element) => {
        if (scrollY >= element.offsetTop - ( window.innerHeight / 2 )) {
          active = element.getAttribute(`id`);
        }
      });

      // If we're at the bottom of the page, ensure the last item is active.
      // This is in case the last item's height is less than the window height.
      if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        active = links[links.length-1].getAttribute(`id`);
      }
    }

    this.activate(active);
  },
  activate: function(active) {
    var hash = window.location.hash.replace(`#`, ``);

    if (this.state.active !== active) {
      if (!hash || document.querySelector(`.nav-anchor#` + hash)) {
        window.history.replaceState({}, null, `#` + active);
      }
      this.setState({
        active: active || ``
      });
    }
  },
  render: function() {
    var active = this.state.active;

    return (
      <div className="container">
        {
          this.state.links.map((element, index) => {
            var link = element.getAttribute(`id`);

            return (
              <MenuLink key={index}
                activate={this.activate}
                active={active}
                item={link}
                href={`#` + link}
              >
                {link}
              </MenuLink>
            );
          })
        }
      </div>
    );
  }
});

var StickyNav = React.createClass({
  getPosition: function() {
    if (!this.stickyContainer) {
      return 0;
    }
    return this.stickyContainer.offsetTop;
  },
  render: function() {
    return (
      <div ref={(element) => { this.stickyContainer = element; }}>
        <StickyContainer className="sticky-container" stickyFrom={this.getPosition}>
          <MenuLinks/>
        </StickyContainer>
      </div>
    );
  }
});

module.exports = StickyNav;
