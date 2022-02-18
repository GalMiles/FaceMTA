class About extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className='About'>
                <div className="col-md-12 text-center">
                    <img src="../home/IconOnly_NoBuffer.png" alt="logo" className="about-logo"/>
                    <br></br>
                </div>
                <p>
                    Gal Miles - galml@mta.ac.il<br></br>
                    Nof Hagage - nofh202@gmail.com
                </p>
            </div>
        );
    }
}

export default About;