import React, { useContext } from 'react';
import BaseLabelInput from '../component/BaseLabelInput';
import TextInput from '../component/TextInput';
import TextButton from '../component/TextButton';
import { signIn, signOut } from '../service/firestore.service';
import UserContext from '../context/UserContext';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { currentUser, login, logout } = useContext(UserContext);
  return (
    <div className="w-full h-screen flex justify-center items-center bg-zinc-400">
      <div className="flex flex-col w-1/4 h-90 bg-white p-8 rounded-xl [&>*]:py-3">
        {currentUser ? (
          <>
            <p className="self-center">{`You are already login with email: ${currentUser.email}`}</p>
            <TextButton
              text="Logout"
              color="bg-blue-500"
              textColor="text-white"
              onClick={async () => {
                await signOut();
                logout();
              }}
            />
          </>
        ) : (
          <>
            <h1 className="self-center">Login</h1>
            <BaseLabelInput label="Email" inputId="email">
              <TextInput
                id="email"
                type="text"
                name="email"
                value={email}
                onChange={(name, value) => setEmail(value as string)}
              />
            </BaseLabelInput>
            <BaseLabelInput label="Password" inputId="password">
              <TextInput
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(name, value) => setPassword(value as string)}
              />
            </BaseLabelInput>
            <TextButton
              text="Login"
              color="bg-blue-500"
              textColor="text-white"
              onClick={async () => {
                const user = await signIn(email, password);
                if (user) login(user);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
