export default function Login({ handleLogin }) {
    return (
        <>
            <h1 class="login__heading">Welcome</h1>
            <form onSubmit={handleLogin} class="login">
              <input type="email" name="email" id="email" placeholder="email" />
              <input type="password" name="password" id="password" placeholder="password" />
              <button type="submit" class="login__submit">SUBMIT</button>
            </form>
            <style>
              {`
                .login__submit {
                    width: 100%;
                    border: 0;
                    border-radius: 8px;
                    background: #89BF05;
                    height: 50px;
                    color: white;
                    font-weight: 700;
                    font-size: 24px;
                    margin-top: 36px;
                }
                .login__heading {
                    margin-top: 36px;
                    text-align: center;
                    margin-bottom: 24px;
                    font-size: 24px;
                }
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active{
                    -webkit-box-shadow: 0 0 0 30px white inset, 0px 4px 4px 0px #00000040 !important;
                }
                .login {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 0 auto;
                    gap: 24px;
                    width: 100%;
                    max-width: 500px;
                }
                .login input {
                    width: 100%;
                    height: 50px;
                    border: 0;
                    border-radius: 8px;
                    box-shadow: 0px 4px 4px 0px #00000040;
                    background-color: white;
                    padding: 8px;
                    text-align: center;
                }
                body {
                  padding: 0;
                  background: linear-gradient(270deg, #92B3D1 0%, rgba(137, 208, 5, 0.3) 60%, rgba(137, 191, 5, 0) 100%);
                }
                body::after {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    background-size: 40px 40px;
                    background-image: linear-gradient(to right, #EEEEEE 1px, transparent 2px), linear-gradient(to bottom, #EEEEEE 2px, transparent 1px);
                    z-index: -1;
                    mix-blend-mode: color-burn;
                    pointer-events: none;
                }
                .topbar {
                    background: transparent;
                    position: static;
                }
              `}
            </style>
          </>
    )
}