class About extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return React.createElement(
            "div",
            { className: "About" },
            React.createElement(
                "div",
                { className: "col-md-12 text-center" },
                React.createElement("img", { src: "../home/IconOnly_NoBuffer.png", alt: "logo", className: "about-logo" }),
                React.createElement("br", null)
            ),
            React.createElement(
                "p",
                null,
                "Gal Miles - galml@mta.ac.il",
                React.createElement("br", null),
                "Nof Hagage - nofh202@gmail.com"
            )
        );
    }
}

export default About;