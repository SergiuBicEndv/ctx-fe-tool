import { twStyles } from '../../styles/twConstants'

export const Header = () => {
  const { navCTA } = twStyles.nav

  return (
    <div>
      <nav className="bg-white  shadow ">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            <div className="w-full justify-between flex items-center">
              <a className="flex-shrink-0" href="/">
                <img
                  className="h-8 w-8"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/900px-Tailwind_CSS_Logo.svg.png?20211001194333"
                  alt="Workflow"
                />
              </a>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a className={navCTA} href="/#">
                    Nav CTA 1
                  </a>
                  <a className={navCTA} href="/#">
                    Nav CTA 2
                  </a>
                </div>
              </div>
            </div>
            <div className="block">
              <div className="ml-4 flex items-center md:ml-6"></div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
