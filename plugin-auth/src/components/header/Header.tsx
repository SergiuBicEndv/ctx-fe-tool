import { useHistory } from 'react-router-dom'
import styles from './header.module.css'

export const Header = () => {
  const history = useHistory()
  const signIn = () => {
    history.push('/signin')
  }

  return (
    <div className={styles.Header}>
      <button onClick={signIn}> Sign In </button>
    </div>
  )
}
