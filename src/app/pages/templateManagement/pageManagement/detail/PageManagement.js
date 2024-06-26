/* eslint-disable no-case-declarations */
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { selectUser } from 'app/store/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { DetailTitleBar } from 'app/theme-layouts/mainLayout/components/common';
import { useLocation, useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import css from 'assets/css/pageManagement.module.css';
import FileUpload from 'app/theme-layouts/shared-components/uploader/FileUploader';
import { useEffect, useState } from 'react';
import convertFile from 'app/utils/convertFile';
import { toast } from 'react-toastify';
import { MenuItem, TextField, Button } from '@mui/material';
import Ptid01WorkModal from 'app/theme-layouts/mainLayout/components/Ptid01WorkModal';
import Ptid02WorkModal from 'app/theme-layouts/mainLayout/components/Ptid02WorkModal';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { getLabel } from 'app/utils/getLabels/pageManagement';
import {
  deleteWork,
  updatePageTem,
} from 'app/pages/templateManagement/pageManagement/store/PageTemplateSlice';
import { confirmAlert } from 'react-confirm-alert';
import { close, open } from 'app/store/common/loadingWrap';
import { setSearchedFlag, selectSearchedFlag } from 'app/pages/dashboard/templateDashboard/store/TemplateDashboardSlice';
import skillsInfo from 'app/data/pageManagement/ptid02/skills';

const ListItemTypes = {
  ITEM: 'item',
};

const DraggableItem = ({ id, index, moveItem, children }) => {
  const [, ref] = useDrag({
    type: ListItemTypes.ITEM,
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: ListItemTypes.ITEM,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      className={`${css.work__item} ${css.list__item}`}
      ref={(node) => ref(drop(node))}
      style={{ cursor: 'grab' }}>
      {children}
    </div>
  );
};

function PageManagement() {
  const moveItem = (fromIndex, toIndex) => {
    const updatedList = [...workList];
    const [movedItem] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, movedItem);
    setWorkList(updatedList);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const location = useLocation();
  const searchedFlag = useSelector(selectSearchedFlag);
  const [profileImg, setProfileImg] = useState(null);
  const [thumbnailImg, setThumbnailImg] = useState(null);
  const [snsSelected, setSnsSelected] = useState('twitter');
  const [skillSelected, setSkillSelected] = useState('none');
  const [snsList, setSnsList] = useState({});
  const [sections, setSections] = useState({
    popol: false,
    profile: false,
    work: false,
    skill: false,
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [popOpen, setPopOpen] = useState(false);
  const [popInfo, setPopInfo] = useState({});
  const [schema, setSchema] = useState(yup.object().shape());
  const [workList, setWorkList] = useState([]);
  const [skillTags, setSkillTags] = useState(['Front-End', 'Back-End', 'Etc']);
  const [skill, setSkill] = useState(0); // 0 front-end, 1 back-end, 2 etc
  const [skills, setSkills] = useState({
    'Front-End': [],
    'Back-End': [],
    Etc: [],
  }); // 0 front-end, 1 back-end, 2 etc
  const [siteListData, setSiteListData] = useState([]);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const activeOption = {
    shouldDirty: true,
    shouldValidate: true,
  };

  const closeModal = () => {
    setPopOpen(false);
  };

  const openModal = () => {
    setPopOpen(true);
  };

  const workObjUpdate = (param) => {
    // param.etc = param.siteList;
    const keys = Object.keys(param);
    for (let i = 0; i < keys.length; i += 1) {
      if (
        ![
          'workSeq',
          'popolSeq',
          'workId',
          'order',
          'title',
          'subTitle',
          'poster',
          'logo',
          'summary',
          'etc',
          'src',
          'lastUpdated',
        ].includes(keys[i])
      ) {
        delete param[keys[i]];
      }
    }
    return param;
  };

  const addWorkResult = (work) => {
    workList.push(workObjUpdate(work));
    dispatch(setSearchedFlag({ works: false }));
    setWorkList(workList);
  };

  const updateWorkResult = (work) => {
    work = workObjUpdate(work);
    for (let i = 0; i < workList.length; i += 1) {
      if (workList[i].workSeq === work.workSeq && workList[i].popolSeq === work.popolSeq) {
        workList[i] = work;
      }
    }
    setWorkList(workList);
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const {
    register,
    reset,
    watch,
    control,
    getValues,
    setValue,
    onChange,
    setError,
    formState,
    trigger,
  } = methods;
  const { errors, isValid, dirtyFields } = formState;
  const form = watch();

  const handleFileSelect = (arg) => {
    arg.file = new File([arg.file], arg.file.name.replaceAll(' ', ''), { type: arg.file.type });
    if (arg.file.type.startsWith('image/')) {
      switch (arg.name) {
        case 'thumbnail':
          setThumbnailImg(arg.file);
          break;
        case 'profile':
          setProfileImg(arg.file);
          break;
        default:
          console.log('default case');
      }
      URL.revokeObjectURL(arg.file);
      setValue(arg.name, arg.file.name);
    } else {
      toast.warning('이미지 파일을 선택해주세요!');
    }
  };

  const saveBtnClick = () => {
    const snsKeys = Object.keys(snsList);
    const clone = JSON.parse(JSON.stringify(snsList));
    for (let i = 0; i < snsKeys.length; i += 1) {
      clone[`${snsKeys[i]}`].id = `${getValues()[`${snsKeys[i]}Id`]}`;
      clone[`${snsKeys[i]}`].link = `${getValues()[`${snsKeys[i]}Link`]}`;
    }
    setSnsList(clone);
    const param = {
      fields: {
        ...getValues(),
        ...{
          userId: user.userId,
          ptId: location.state?.template?.popolInfo.ptId,
          userKey: user.userKey,
        },
        workList,
        snsList: Object.keys(snsList).length === 0 ? '{}' : JSON.stringify(clone),
      },
      files: {
        profileImg,
        thumbnailImg,
      },
    };
    param.fields.phone = param.fields.phone.replace(/(\d{3})(\d{3,4})(\d{3,4})/, '$1-$2-$3');
    if (param.fields.ptId === 'ptid02') {
      const etc = {
        job: param.fields.job,
        aboutMe: param.fields.aboutMe.replaceAll('\n', '\\n'),
        skills,
        sns: clone,
      };
      param.fields.snsList = JSON.stringify(etc);
    }
    setUpdateLoading(true);
    dispatch(updatePageTem(param))
      .then(({ payload }) => {
        if (payload.status === 200) {
          if (thumbnailImg !== null) {
            setValue('thumbnailOld', thumbnailImg.name, activeOption);
          }
          if (profileImg !== null) {
            setValue('profileOld', profileImg.name, activeOption);
          }
          const workOrderSet = [...workList];
          for (let i = 0; i < workOrderSet.length; i += 1) {
            workOrderSet[i].order = i;
          }
          setWorkList(workOrderSet);
          dispatch(setSearchedFlag({ popols: false }));
          toast.success('포폴 정보가 업데이트 되었습니다.');
        } else {
          throw Error('포폴 업데이트중 에러가 발생하였습니다.');
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error('포폴 업데이트중 에러가 발생하였습니다.');
      })
      .finally(() => {
        setUpdateLoading(false);
      });
  };

  const workDeleteClick = (e) => {
    confirmAlert({
      title: `'${e.title}' 프로젝트를 삭제 하시겠습니까?`,
      // message: '메세지 공간입니다.',
      buttons: [
        {
          label: '예',
          onClick: () => {
            dispatch(open());
            const param = Object.assign(e, {
              ptId: location.state?.template?.popolInfo.ptId,
              userId: user.userId,
            });
            dispatch(deleteWork(param))
              .then(({ payload }) => {
                if (payload.status === 200) {
                  setWorkList(payload.data.response);
                  dispatch(setSearchedFlag({ works: false }));
                  toast.success(
                    `'${e.title}' ${getLabel(
                      location?.state?.template?.popolInfo?.ptId,
                      'workTitle'
                    )} 삭제 완료.`
                  );
                }
              })
              .catch((error) => {
                console.log(error);
                toast.error(
                  `'${e.title}' ${getLabel(
                    location?.state?.template?.popolInfo?.ptId,
                    'workTitle'
                  )} 삭제 실패.`
                );
              })
              .finally(() => {
                dispatch(close());
              });
          },
        },
        {
          label: '취소',
          onClick: () => { },
        },
      ],
    });
  };

  const sectionTitleClick = (e, section) => {
    const el = e.currentTarget;
    el.classList.toggle('active');
    setSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
    el.nextElementSibling.classList.toggle('active');
    if (el.classList.contains('active')) {
      el.childNodes[1].style.transform = 'rotate(0deg)';
    } else {
      el.childNodes[1].style.transform = 'rotate(180deg)';
    }
  };

  const setImgFile = (imgFileName, backFileName, setImgFile, ptId) => {
    if (imgFileName) {
      setValue(backFileName, imgFileName, activeOption);
      const remoteImageUrl = `https://site.mypopol.com/${ptId}/${user.userId}/img/${imgFileName}`;
      const fileName = imgFileName;
      const imgType =
        `${imgFileName.split('.')[1]}` === 'jpg' ? 'jpeg' : `${imgFileName.split('.')[1]}`;
      convertFile(remoteImageUrl, fileName, `image/${imgType}`, async function (error, file) {
        if (error) {
          toast.error(error);
          return;
        }

        const loadComplate = () => {
          setImgFile(file);
        };

        await loadComplate();
      });
    }
  };

  useEffect(() => {
    if (location.state === null) {
      navigate('/template/page');
    } else if (location.pathname.split('/')[3] !== user.userId) {
      toast.warning('올바른 접근이 아닙니다.');
      navigate('/template/page');
    } else {
      const { popols, works } = searchedFlag;
      if (!popols || !works) {
        navigate('/template/page')
      }
      const {
        popolName,
        thumbnail,
        mainColor,
        fakeName,
        email,
        phone,
        title,
        profileImg: profile,
        ptId,
        icon,
        sns,
      } = location.state?.template?.popolInfo;
      // console.log(location.state)
      // console.log(location)
      setValue('popolName', popolName, activeOption);
      setValue('mainColor', mainColor, activeOption);
      setValue('fakeName', fakeName, activeOption);
      setValue('email', email, activeOption);
      setValue('phone', phone.replaceAll('-', ''), activeOption);
      setValue('title', title, activeOption);
      setValue('thumbnail', thumbnail, activeOption);
      setValue('profile', profile, activeOption);
      setValue('icon', icon, activeOption);
      setImgFile(thumbnail, 'thumbnailOld', setThumbnailImg, ptId);
      setImgFile(profile, 'profileOld', setProfileImg, ptId);
      setWorkList(location.state?.template?.worksInfo);
      if (sns !== null && sns !== '' && sns !== undefined) {
        let snsListLocal;
        const shape = {};
        const etc = JSON.parse(sns);
        switch (ptId) {
          case 'ptid01':
            setSnsList(etc);
            snsListLocal = etc;
            fetch('https://site.mypopol.com/ptid01/src/data/siteList.json')
              .then((res) => res.json())
              .then((siteList) => {
                setSiteListData(siteList);
              })
              .catch((error) => {
                console.error('데이터를 가져오는 중 오류가 발생했습니다.', error);
              });
            break;
          case 'ptid02':
            setSkills(etc.skills);
            setSnsList(etc.sns);
            snsListLocal = etc.sns;
            shape.job = yup.string().required('어떤 개발자인지 입력주세요.');
            shape.aboutMe = yup.string().required('자기소개를 입력해주세요.');
            setValue(`job`, etc.job, activeOption);
            setValue(`aboutMe`, etc.aboutMe, activeOption);
            break;
          default:
        }
        const snsKeys = Object.keys(snsListLocal);
        const snsValues = Object.values(snsListLocal);
        for (let i = 0; i < snsKeys.length; i += 1) {
          shape[`${snsKeys[i]}Id`] = yup.string().required(`${snsKeys[i]} 아이디를 입력해주세요`);
          shape[`${snsKeys[i]}Link`] = yup.string().required(`${snsKeys[i]} 링크를 입력해주세요`);
          // 값 세팅
          setValue(`${snsKeys[i]}Id`, snsValues[i].id, activeOption);
          setValue(`${snsKeys[i]}Link`, snsValues[i].link, activeOption);
        }
        setSchema(
          yup.object().shape({
            popolName: yup.string().required('포폴명은 필수 정보 입니다.'),
            thumbnail: yup.string(), // 파일여부?
            profile: yup.string(), // 파일여부?
            mainColor: yup.string().notOneOf([' ', null], '메인색상을 선택해 주세요.'),
            icon: yup.string().notOneOf([' ', null], '아이콘타입을 선택해 주세요.'),
            fakeName: yup
              .string()
              .required(
                `${getLabel(
                  location?.state?.template?.popolInfo?.ptId,
                  'fakeName'
                )}은 필수 정보 입니다.`
              ),
            email: yup
              .string()
              .email('이메일 형식으로 입력해주세요.')
              .required('이메일은 필수 정보 입니다.'),
            phone: yup
              .string()
              .matches(/^[0-9]{9,11}$/i, "번호는 '-' 없이 9~11자리 번호로 입력해주세요"),
            title: yup.string().required('인사글은 필수 정보 입니다.'),
            ...shape,
          })
        );
      }
    }
  }, [setValue, register, setSnsList, location.state]);

  return (
    <div className={`section__grid__wrap content common__detail ${css.page__tem__wrap}`}>
      <DetailTitleBar
        saveBtnClick={saveBtnClick}
        isValid={isValid}
        dirtyFields={dirtyFields}
        updateLoading={updateLoading}
      />
      <section>
        {location?.state?.template?.popolInfo?.ptId === 'ptid01' && (
          <Ptid01WorkModal
            isOpen={popOpen}
            onRequestClose={closeModal}
            popInfo={popInfo}
            addWorkResult={addWorkResult}
            updateWorkResult={updateWorkResult}
            siteListData={siteListData}
          />
        )}
        {location?.state?.template?.popolInfo?.ptId === 'ptid02' && (
          <Ptid02WorkModal
            isOpen={popOpen}
            onRequestClose={closeModal}
            popInfo={popInfo}
            addWorkResult={addWorkResult}
            updateWorkResult={updateWorkResult}
          />
        )}
        <div className={`${css.detail__section} section__inner`}>
          <div
            onClick={(e) => {
              sectionTitleClick(e, 'popol');
            }}
            className={`${css.title__bar} top line`}>
            <p className="f__medium normal__title">포폴 정보</p>
            <span className={css.arrow__btn} />
          </div>
          <div
            className={`${css.section__content} ${sections.popol && css.section__content__active}`}>
            <div className="inner">
              <div className={css.list__item}>
                <p className="f__medium">썸네일 이미지</p>
                {thumbnailImg === null || !thumbnailImg.type.startsWith('image/') ? (
                  <div>
                    <FileUpload
                      name="thumbnail"
                      onFileSelect={handleFileSelect}
                      height="200px"
                      control={control}
                    />
                  </div>
                ) : (
                  <>
                    <div className={css.thumbnail__img__box}>
                      <img src={URL.createObjectURL(thumbnailImg)} alt={thumbnailImg.name} />
                    </div>
                    <Controller
                      name="thumbnail"
                      control={control}
                      render={({ field }) => (
                        <div className={css.file__status}>
                          <p className="f__regular">{field.value}</p>
                          <span
                            onClick={(e) => {
                              setThumbnailImg(null);
                              setValue('thumbnail', '');
                            }}
                            className={css.remove__btn}
                          />
                        </div>
                      )}
                    />
                  </>
                )}
              </div>
              <div className={css.list__item}>
                <Controller
                  name="popolName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      InputLabelProps={{ shrink: true }}
                      className="mb-24"
                      label="포폴명"
                      autoFocus
                      type="text"
                      error={!!errors.popolName}
                      helperText={errors?.popolName?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />
              </div>
              <div className={css.list__item}>
                <p className="f__medium">메인 색상</p>
                <ul className={css.color__item__wrap}>
                  {['rgb(255,182,59)', 'rgb(75,135,224)', 'rgb(75,224,149)', 'rgb(55,65,81)'].map(
                    (color) => (
                      <li
                        onClick={(e) => {
                          setValue('mainColor', color);
                        }}
                        className={
                          getValues().mainColor?.trim() === color ? css.selected__color : ''
                        }
                        key={color}>
                        <span
                          style={{ backgroundColor: color, boxShadow: `0 10px 14px -5px ${color}` }}
                        />
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className={`${css.detail__section} section__inner`}>
          <div
            onClick={(e) => {
              sectionTitleClick(e, 'profile');
            }}
            className={`${css.title__bar} top line`}>
            <p className="f__medium normal__title">프로필 정보</p>
            <span className={css.arrow__btn} />
          </div>
          <div
            className={`${css.section__content} ${sections.profile && css.section__content__active
              }`}>
            <div className={css.inner}>
              <div className={css.list__item}>
                <p className="f__medium">프로필 이미지</p>
                {profileImg === null || !profileImg.type.startsWith('image/') ? (
                  <div>
                    <FileUpload
                      name="profile"
                      onFileSelect={handleFileSelect}
                      height="160px"
                      control={control}
                    />
                  </div>
                ) : (
                  <>
                    <div className={css.profile__img__box}>
                      <img src={URL.createObjectURL(profileImg)} alt={profileImg.name} />
                    </div>
                    <Controller
                      name="profile"
                      control={control}
                      render={({ field }) => (
                        <div className={css.file__status}>
                          <p className="f__regular">{field.value}</p>
                          <span
                            onClick={(e) => {
                              setProfileImg(null);
                              setValue('profile', '');
                            }}
                            className={css.remove__btn}
                          />
                        </div>
                      )}
                    />
                  </>
                )}
              </div>
              <div className={css.list__item}>
                <Controller
                  name="fakeName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      InputLabelProps={{ shrink: true }}
                      className="mb-24"
                      label={getLabel(location.state?.template?.popolInfo?.ptId, 'fakeName')}
                      autoFocus
                      required
                      type="text"
                      error={!!errors.fakeName}
                      helperText={errors?.fakeName?.message}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>
              {location?.state?.template?.popolInfo?.ptId === 'ptid02' && (
                <div className={css.list__item}>
                  <Controller
                    name="job"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        InputLabelProps={{ shrink: true }}
                        className="mb-24"
                        label="개발자 유형"
                        autoFocus
                        type="text"
                        error={!!errors.job}
                        helperText={errors?.job?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                </div>
              )}
              <div className={css.list__item}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      InputLabelProps={{ shrink: true }}
                      className="mb-24"
                      fullWidth
                      required
                      label="인사글"
                      multiline
                      error={!!errors.title}
                      helperText={errors?.title?.message}
                      rows={location?.state?.template?.popolInfo?.ptId === 'ptid02' ? 1 : 3}
                      variant="outlined"
                    />
                  )}
                />
              </div>
              {location?.state?.template?.popolInfo?.ptId === 'ptid02' && (
                <div className={css.list__item}>
                  <Controller
                    name="aboutMe"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        InputLabelProps={{ shrink: true }}
                        className="mb-24"
                        fullWidth
                        required
                        label="자기소개"
                        multiline
                        error={!!errors.aboutMe}
                        helperText={errors?.aboutMe?.message}
                        rows={5}
                        variant="outlined"
                      />
                    )}
                  />
                </div>
              )}
              <div className={`${css.list__item} ${css.profile__icon__list}`}>
                <div>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        InputLabelProps={{ shrink: true }}
                        className="mb-24"
                        label="이메일"
                        autoFocus
                        type="text"
                        error={!!errors.email}
                        helperText={errors?.email?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        InputLabelProps={{ shrink: true }}
                        className="mb-24"
                        label="전화번호"
                        autoFocus
                        type="text"
                        error={!!errors.phone}
                        helperText={errors?.phone?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                </div>
              </div>
              <div className={css.list__item}>
                <p className="f__medium">SNS 정보</p>
                <div className={css.sns__selector}>
                  <TextField
                    select
                    value={snsSelected}
                    label="SNS"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                      setSnsSelected(e.target.value);
                    }}>
                    {[
                      { name: '트위터', value: 'twitter' },
                      { name: '인스타그램', value: 'instargram' },
                      { name: '유튜브', value: 'youtube' },
                      { name: '카카오톡', value: 'kakaotalk' },
                      { name: '깃허브', value: 'github' },
                      { name: '페이스북', value: 'facebook' },
                    ].map((obj, idx) => (
                      <MenuItem key={idx} value={obj.value}>
                        {obj.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    variant="contained"
                    className="custom__btn"
                    onClick={() => {
                      if (!Object.keys(snsList).includes(snsSelected)) {
                        const clone = JSON.parse(JSON.stringify(snsList));
                        register(`${snsSelected}Id`, {
                          required: `${snsSelected} 아이디를 입력해주세요`,
                        });
                        register(`${snsSelected}Link`, {
                          required: `${snsSelected} 링크를 입력해주세요`,
                        });
                        setValue(`${snsSelected}Id`, '', activeOption);
                        setValue(`${snsSelected}Link`, '', activeOption);
                        clone[`${snsSelected}`] = {
                          id: '',
                          link: '',
                        };
                        setSnsList(clone);
                      }
                    }}>
                    <span className="f__medium">추가</span>
                    <svg
                      size="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 100 100">
                      <use
                        href={`${process.env.PUBLIC_URL}/images/icon/heroicons-outline.svg#plus`}
                      />
                    </svg>
                  </Button>
                </div>
                {Object.keys(snsList).map((obj) => (
                  <div
                    key={obj}
                    className={`${css.sns__item} ${css.profile__icon__list} ${css.flex__row}`}>
                    <span className={css.profile__icon}>
                      <img
                        src={`https://site.mypopol.com/src/img/icon/${getValues().icon}/${obj}.png`}
                        alt={`${obj} icon`}
                      />
                    </span>
                    <Controller
                      name={`${obj}Id`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          InputLabelProps={{ shrink: true }}
                          className="mb-24"
                          label="아이디"
                          autoFocus
                          type="text"
                          // error={!!errors.fakeName}
                          // helperText={errors?.fakeName?.message}
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                    <Controller
                      name={`${obj}Link`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          className="mb-24"
                          InputLabelProps={{ shrink: true }}
                          label="링크"
                          autoFocus
                          type="text"
                          placeholder="https://example.com"
                          // error={!!errors.fakeName}
                          // helperText={errors?.fakeName?.message}
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                    <span
                      className={css.remove__btn}
                      onClick={() => {
                        const clone = JSON.parse(JSON.stringify(snsList));
                        delete clone[obj];
                        delete schema.fields[`${obj}Id`];
                        delete schema.fields[`${obj}Link`];
                        setSnsList(clone);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className={`${css.detail__section} section__inner`}>
          <div
            onClick={(e) => {
              sectionTitleClick(e, 'work');
            }}
            className={`${css.title__bar} top line`}>
            <p className="f__medium normal__title">
              {getLabel(location?.state?.template?.popolInfo?.ptId, 'workTitle')} 정보
            </p>
            <span className={css.arrow__btn} />
          </div>
          <div
            className={`${css.section__content} ${sections.work && css.section__content__active}`}>
            <div className="inner">
              <div>
                <Button
                  variant="contained"
                  className="custom__btn"
                  style={{ width: '100%' }}
                  onClick={() => {
                    setPopInfo({
                      ptId: location.state?.template?.popolInfo.ptId,
                      popolSeq: location.state?.template?.popolInfo.popolSeq,
                      state: '추가',
                    });
                    openModal();
                  }}>
                  <span className="f__medium">
                    {getLabel(location?.state?.template?.popolInfo?.ptId, 'workTitle')} 추가
                  </span>
                  <svg
                    size="24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100">
                    <use
                      href={`${process.env.PUBLIC_URL}/images/icon/heroicons-outline.svg#plus`}
                    />
                  </svg>
                </Button>
              </div>
              <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                {workList.map((item, index) => (
                  <DraggableItem
                    key={index}
                    id={item.order}
                    data={item}
                    index={index}
                    moveItem={moveItem}>
                    <b className={`${css.work__order} f__bold`}>{index + 1}</b>
                    <div className={`${css.work__item__poster}`}>
                      {item.poster && item.poster !== 'none' && (
                        <img
                          src={`https://site.mypopol.com/${location?.state?.template?.popolInfo?.ptId}/${user.userId}/img/${item.src}/${item.poster}`}
                          alt={`${item.title} 포스터이미지`}
                        />
                      )}
                      {item.poster === 'none' && (
                        <img src="https://site.mypopol.com/src/img/no_img.jpg" alt="이미지 없음" />
                      )}
                    </div>
                    <ul className={css.work__info__wrap}>
                      <li className="f__medium">{item.title}</li>
                      <li className="f__medium">{item.subTitle}</li>
                      <li />
                      {/* 사이트 아이콘 */}
                    </ul>
                    <div className={css.work__btn__wrap}>
                      <Button
                        variant="contained"
                        className={`${css.modify__btn} custom__btn`}
                        onClick={() => {
                          setPopInfo({
                            ptId: location.state?.template?.popolInfo.ptId,
                            popolSeq: location.state?.template?.popolInfo.popolSeq,
                            state: '수정',
                            workInfo: item,
                          });
                          openModal();
                        }}>
                        <svg
                          size="24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 100 100">
                          <use
                            href={`${process.env.PUBLIC_URL}/images/icon/heroicons-outline.svg#pencil`}
                          />
                        </svg>
                      </Button>
                      <Button
                        variant="contained"
                        className="custom__btn delete"
                        onClick={() => {
                          workDeleteClick(item);
                        }}>
                        <svg
                          size="24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 100 100">
                          <use
                            href={`${process.env.PUBLIC_URL}/images/icon/heroicons-outline.svg#trash`}
                          />
                        </svg>
                      </Button>
                    </div>
                  </DraggableItem>
                ))}
              </DndProvider>
            </div>
          </div>
        </div>
      </section>
      {location?.state?.template?.popolInfo?.ptId === 'ptid02' && (
        <section>
          <div className={`${css.detail__section} section__inner`}>
            <div
              onClick={(e) => {
                sectionTitleClick(e, 'skill');
              }}
              className={`${css.title__bar} top line`}>
              <p className="f__medium normal__title">기술스택(업무 툴/스킬)</p>
              <span className={css.arrow__btn} />
            </div>
            <div
              className={`${css.section__content} ${sections?.skill && css.section__content__active
                }`}>
              <div className="inner">
                <div className={css.list__item}>
                  <div className={css.select__list}>
                    {skillTags.map((obj, idx) => (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSkill(idx);
                          setSkillSelected('none');
                        }}
                        key={idx}
                        className={`${css.item} f__medium`}>
                        <p>{obj}</p>
                      </div>
                    ))}
                    <div style={{ left: `${skill * 33.33}%` }} className={css.selected__tab} />
                  </div>
                </div>
                <div>
                  <div className={css.sns__selector}>
                    <TextField
                      select
                      value={skillSelected}
                      label="기술 선택"
                      defaultValue="none"
                      variant="outlined"
                      fullWidth
                      onChange={(e) => {
                        setSkillSelected(e.target.value);
                      }}>
                      <MenuItem value="none">기술을 선택해주세요</MenuItem>
                      {skillsInfo[skill].map((obj, idx) => (
                        <MenuItem key={idx} value={obj.value}>
                          {obj.value}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button
                      disabled={skillSelected === 'none'}
                      variant="contained"
                      className="custom__btn"
                      onClick={() => {
                        const clone = JSON.parse(JSON.stringify(skills));
                        if (!clone[skillTags[skill]]?.includes(skillSelected)) {
                          clone[skillTags[skill]] = [...clone[skillTags[skill]], skillSelected];
                        }
                        setSkills(clone);
                      }}>
                      <span className="f__medium">추가</span>
                      <svg
                        size="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 100 100">
                        <use
                          href={`${process.env.PUBLIC_URL}/images/icon/heroicons-outline.svg#plus`}
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
                <div className={`${css.skill__list__item}`}>
                  {skills[skillTags[skill]]?.map((item, idx) => (
                    <div className={css.skill__item} key={idx}>
                      <div className={css.img__box}>
                        <img
                          src={`https://site.mypopol.com/ptid02/src/img/skills/${item
                            .replaceAll(' ', '')
                            .toLowerCase()}.svg`}
                          alt={item}
                        />
                      </div>
                      <p>
                        {item}{' '}
                        <span
                          onClick={(e) => {
                            const clone = JSON.parse(JSON.stringify(skills));
                            clone[skillTags[skill]] = clone[skillTags[skill]].filter(
                              (prev) => prev !== item
                            );
                            setSkills(clone);
                          }}
                          className={css.remove__btn}
                        />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default PageManagement;
