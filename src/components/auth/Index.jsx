import { useEffect, useState } from 'react'
import LoginForm from './Login'
import SignUpForm from './SignUp'

export default function Index({ onLogin, onSignUp, errors, setErrors }) {
  const [needLogin, setNeedLogin] = useState(true)
  useEffect(() => {
    setErrors('')
  }, [needLogin])
  return needLogin ? (
    <LoginForm onLogin={onLogin} errors={errors} setNeedLogin={setNeedLogin} />
  ) : (
    <SignUpForm
      onSignUp={onSignUp}
      errors={errors}
      setNeedLogin={setNeedLogin}
    />
  )
}
