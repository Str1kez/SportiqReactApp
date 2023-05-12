export default function Footer(props) {
  return (
    <div className="contact-section">
      <div className="overlay"></div>
      <div className="container">
        <footer className="footer">
          <p className="infos">
            &copy; <script>document.write(new Date().getFullYear())</script>,
            Made with <i className="ti-heart text-danger"></i> by{' '}
            <a href="http://www.devcrud.com">DevCRUD</a>
          </p>
        </footer>
      </div>
    </div>
  )
}
