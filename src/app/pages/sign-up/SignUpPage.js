import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { TextField, Button, Paper, Typography, Link } from '@mui/material';
import { Email, Smartphone } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Lottie from 'react-lottie';
import animationData from 'app/data/loading.json';
import css from 'assets/css/signup.module.css';
import jwtService from '../../auth/services/jwtService';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  userId: yup.string().required('유저ID를 입력해 주세요.'),
  password: yup
    .string()
    .required('비밀번호를 입력해 주세요.')
    .min(8, '비밀번호는 최소 8자 이상 입력해 주세요.'),
});

const defaultValues = {
  userId: '',
  password: '',
};

function SignUpPage() {
  const { step } = useParams();
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);
  const [authStep, setAuthStep] = useState(1);
  // 1 : 인증타입 선택, 2 : 인증번호 입력, 3 : 아이디 비밀번호 입력
  const [authType, setAuthType] = useState(null);
  // 휴대폰, 이메일
  const [authFlag, setAuthFlag] = useState(false);
  // 본인인증 결과
  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const authTypeClick = (type) => {
    setAuthType(type)
    navigate("/sign-up/2")
  }

  const resetPage = () => {
    navigate("/sign-up/1")
    setAuthStep(1)
  }

  const authCheck = (param) => {
    if (param === 2) {
      if (!authType) {
        toast.warning("인증방법을 선택해주세요.")
        resetPage()
      }
    } else if (param === 3) {
      if (!authFlag) {
        toast.warning("본인인증을 진행해주세요.")
        resetPage()
      }
    }
  }

  useEffect(() => {
    setAuthStep(Number(step))
    if (step && step >= 1 && step <= 3) {
      switch (step) {
        case 1:
          break;
        case 2:
          authCheck(2)
          break;
        case 3:
          authCheck(3)
          break;
        default:
      }
    } else {
      resetPage()
    }
  }, [step]);

  return (
    <>
      <div className={`${css.signin__wrap} vertical__scroll`}>
        <Paper className={css.paper}>
          <div className={css.signin__wrap__inner}>
            <div className={css.left__section}>
              <div className={css.left__inner}>
                <h1 className={`f__bold ${css.main__title}`}>
                  {
                    authStep === 1 && '본인 인증'
                  }
                  {
                    authStep === 2 && `${authType} 인증`
                  }
                  {
                    authStep === 3 && `계정 정보 입력`
                  }
                </h1>
                <div className={css.content}>
                  {
                    authStep === 1 && (
                      <div className={css.auth__type__btn}>
                        <Button
                          variant="contained"
                          color="secondary"
                          className='custom__btn f__medium'
                          size="large"
                          onClick={() => { authTypeClick("휴대폰") }}
                        >
                          <span className="mx-8 text-white font-bold">휴대폰 인증</span>
                          <Smartphone />
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          className='custom__btn f__medium'
                          size="large"
                          onClick={() => { authTypeClick("이메일") }}
                        >
                          <span className="mx-8 text-white font-bold">이메일 인증</span>
                          <Email />
                        </Button>
                      </div>
                    )
                  }
                </div>
                <div className={css.signin__notice}>
                  <Typography className="f__regular">이전 페이지로 돌아가시겠어요?&nbsp;</Typography>
                  <Link className="f__medium" onClick={() => { navigate(-1) }}>
                    뒤로가기
                  </Link>
                </div>
                <div className={css.signin__notice}>
                  <Typography className="f__regular">계정이 있으신가요?&nbsp;</Typography>
                  <Link className="f__medium" onClick={() => { navigate("/sign-in") }}>
                    로그인
                  </Link>
                </div>
              </div>
            </div>
            <div className={css.right__section}>
              <svg viewBox="0 0 220 192" fill="none">
                <defs>
                  <pattern
                    id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="4" height="4" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
              </svg>
              <svg
                viewBox="0 0 960 540"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMax slice"
                xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="currentColor" strokeWidth="100">
                  <circle r="234" cx="196" cy="23" />
                  <circle r="234" cx="790" cy="491" />
                </g>
              </svg>
              <h2>Mypopol Admin System</h2>
              <p>안녕하세요. 마이포폴 관리자 시스템에 오신걸 환영합니다!</p>
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
}

export default SignUpPage;
