'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaUsers, FaImage, FaInfoCircle, FaTrophy, FaUserPlus, FaCheck, FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import Image from 'next/image'

export default function CreateTeamPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    logo: '',
    teamColor: '#3b82f6'
  })
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    image: '',
    logo: ''
  })
  const [formStep, setFormStep] = useState(1)
  const [successMessage, setSuccessMessage] = useState('')
  const [teams, setTeams] = useState([])
  const [previewImage, setPreviewImage] = useState('')
  const [previewLogo, setPreviewLogo] = useState('')
  const [createdTeamId, setCreatedTeamId] = useState(null)

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/login?redirect=/teams/create')
      return
    }
    
    setIsLoaded(true)
  }, [router, user])

  // Добавляем эффект для обновления превью при изменении URL
  useEffect(() => {
    // Проверяем, является ли URL изображения валидным
    const isValidImageUrl = (url) => {
      if (!url || url.trim() === '') return false;
      
      // Проверяем наличие расширения изображения или известных доменов с изображениями
      const hasImageExtension = /\.(jpeg|jpg|gif|png|webp|svg|bmp)$/i.test(url);
      const isImageHost = [
        'unsplash.com', 'images.', 'img.', 'imgur.', 'picsum.photos',
        'cloudinary.com', 'ibb.co', 'flickr.com', 'googleusercontent.com',
        'pexels.com', 'pixabay.com', 'res.cloudinary.com'
      ].some(host => url.includes(host));
      
      return hasImageExtension || isImageHost || url.includes('data:image/');
    }

    // Проверяем URL фонового изображения
    if (isValidImageUrl(formData.image)) {
      setPreviewImage(formData.image);
      // Сбрасываем ошибку, если она была
      if (errors.image) {
        setErrors(prev => ({...prev, image: ''}));
      }
    } else {
      setPreviewImage('');
      if (formData.image && formData.image.trim() !== '') {
        setErrors(prev => ({...prev, image: 'Укажите корректный URL изображения'}));
      }
    }

    // Проверяем URL логотипа
    if (isValidImageUrl(formData.logo)) {
      setPreviewLogo(formData.logo);
      if (errors.logo) {
        setErrors(prev => ({...prev, logo: ''}));
      }
    } else {
      setPreviewLogo('');
      if (formData.logo && formData.logo.trim() !== '') {
        setErrors(prev => ({...prev, logo: 'Укажите корректный URL изображения для логотипа'}));
      }
    }
  }, [formData.image, formData.logo, errors]);

  // Добавляем отдельный useEffect для логирования изменений шага
  useEffect(() => {
    console.log(`Изменился шаг формы на: ${formStep}`);
  }, [formStep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear errors when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = (step = formStep) => {
    let isValid = true;
    const newErrors = { ...errors };

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Название команды обязательно';
        isValid = false;
      } else if (formData.name.length < 3) {
        newErrors.name = 'Название команды должно содержать не менее 3 символов';
        isValid = false;
      }

      if (!formData.description.trim()) {
        newErrors.description = 'Описание команды обязательно';
        isValid = false;
      } else if (formData.description.length < 10) {
        newErrors.description = 'Описание должно содержать не менее 10 символов';
        isValid = false;
      }
    }

    setErrors(newErrors);
    console.log("Валидация формы:", isValid, newErrors);
    return isValid;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Нельзя отправить форму на шаге 1 - нужно перейти к шагу 2
    if (formStep === 1) {
      if (validateBasicInfo()) {
        setFormStep(2);
      }
      return;
    }
    
    // Только на шаге 2 можно создать команду
    if (formStep === 2) {
      setIsSubmitting(true);
      
      try {
        // Проверяем и обрабатываем имя команды для корректного отображения
        const teamName = formData.name.trim();
        console.log("Имя команды:", teamName); // Для отладки
        
        // Создаем новую команду
        const newTeamId = Date.now();
        const newTeam = {
          id: newTeamId,
          name: teamName,
          description: formData.description,
          memberCount: 1,
          competitionCount: 0,
          image: formData.image || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2069',
          logo: formData.logo || '',
          teamColor: formData.teamColor,
          ownerId: user?.id,
          members: [user?.id],
          createdAt: new Date().toISOString()
        };
        
        // Загружаем существующие команды
        let teams = [];
        try {
          const storedTeams = localStorage.getItem('teams');
          if (storedTeams) {
            teams = JSON.parse(storedTeams);
          }
        } catch (error) {
          console.error('Ошибка при загрузке команд:', error);
        }
        
        // Добавляем команду и сохраняем
        teams.push(newTeam);
        localStorage.setItem('teams', JSON.stringify(teams));
        
        // Сохраняем ID созданной команды и переходим к шагу 3
        setCreatedTeamId(newTeamId);
        setTeams([...teams]); 
        setSuccessMessage('Команда успешно создана!');
        setFormStep(3);
      } catch (error) {
        console.error('Ошибка при создании команды:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Отдельная функция для валидации основной информации
  const validateBasicInfo = () => {
    const newErrors = {...errors};
    let isValid = true;
    
    // Проверка имени
    if (!formData.name.trim()) {
      newErrors.name = 'Название команды обязательно';
      isValid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = 'Название команды должно содержать не менее 3 символов';
      isValid = false;
    } else {
      newErrors.name = '';
    }
    
    // Проверка описания
    if (!formData.description.trim()) {
      newErrors.description = 'Описание команды обязательно';
      isValid = false;
    } else if (formData.description.length < 10) {
      newErrors.description = 'Описание должно содержать не менее 10 символов';
      isValid = false;
    } else {
      newErrors.description = '';
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Кнопки для навигации между шагами
  const handleNextStep = () => {
    console.log(`Вызов handleNextStep, текущий шаг: ${formStep}`);
    if (formStep === 1 && validateBasicInfo()) {
      console.log("Переходим на шаг 2 - Оформление");
      setFormStep(2);
    }
  };
  
  const handlePrevStep = () => {
    if (formStep === 2) {
      setFormStep(1);
    }
  };

  // Функция для быстрой вставки примеров URL изображений
  const insertExampleImage = (type, url) => {
    setFormData(prev => ({
      ...prev,
      [type]: url
    }));
  }

  // Функция для вставки URL из буфера обмена
  const pasteFromClipboard = async (fieldName) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim() !== '') {
        setFormData(prev => ({
          ...prev,
          [fieldName]: text.trim()
        }));
      }
    } catch (error) {
      console.error('Ошибка при вставке из буфера обмена:', error);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className={`min-h-screen flex flex-col ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 bg-gray-50`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">Создание команды</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Создайте свою команду для участия в соревнованиях
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-10"
            >
              <div className="flex items-center justify-center">
                <div className="flex w-full max-w-3xl">
                  <div className={`flex-1 ${formStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className="relative mb-2">
                      <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center bg-white shadow-md border-2 border-primary-500">
                        <span className="text-primary-600 font-bold">1</span>
                      </div>
                      <div className={`absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase ${formStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                        Основная информация
                      </div>
                    </div>
                    <div className="hidden sm:block w-full bg-gradient-to-r from-transparent via-primary-500 to-primary-500 h-1"></div>
                  </div>
                  
                  <div className={`flex-1 ${formStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className="relative mb-2">
                      <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center bg-white shadow-md border-2 ${formStep >= 2 ? 'border-primary-500' : 'border-gray-300'}`}>
                        <span className={formStep >= 2 ? 'text-primary-600' : 'text-gray-400'}>2</span>
                      </div>
                      <div className={`absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase ${formStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                        Оформление
                      </div>
                    </div>
                    <div className="hidden sm:block w-full bg-gray-200 h-1"></div>
                  </div>
                  
                  <div className={`flex-1 ${formStep >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className="relative mb-2">
                      <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center bg-white shadow-md border-2 ${formStep >= 3 ? 'border-primary-500' : 'border-gray-300'}`}>
                        <span className={formStep >= 3 ? 'text-primary-600' : 'text-gray-400'}>3</span>
                      </div>
                      <div className={`absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase ${formStep >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                        Готово
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={formVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden"
            >
              {/* Abstract design elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-100 rounded-full -mr-20 -mt-20 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-100 rounded-full -ml-16 -mb-16 opacity-50"></div>
              
              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-center"
                >
                  <FaCheck className="mr-2 text-green-500" />
                  {successMessage}
                </motion.div>
              )}
              
              {/* Для первого и второго шага используем форму */}
              {formStep < 3 && (
                <form onSubmit={handleSubmit}>
                  {formStep === 1 && (
                    <>
                      <motion.div variants={inputVariants} className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                          Название команды *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUsers className="text-gray-400" />
                          </div>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full py-3 px-4 pl-10 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                            placeholder="Введите название команды"
                          />
                        </div>
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <FaInfoCircle className="mr-1" />
                            {errors.name}
                          </p>
                        )}
                      </motion.div>
                      
                      <motion.div variants={inputVariants} className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                          Описание команды *
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          className={`w-full py-3 px-4 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                          placeholder="Опишите вашу команду, ее цели и особенности"
                          rows={4}
                        />
                        {errors.description && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <FaInfoCircle className="mr-1" />
                            {errors.description}
                          </p>
                        )}
                      </motion.div>
                      
                      <motion.div variants={inputVariants} className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Link
                          href="/teams"
                          className="btn-outline py-3 flex-1 flex items-center justify-center"
                        >
                          <FaArrowLeft className="mr-2" /> Отмена
                        </Link>
                        <button
                          type="button" // Важно! Не submit
                          className="btn-primary py-3 flex-1 flex items-center justify-center"
                          onClick={handleNextStep}
                        >
                          Перейти к оформлению <FaUserPlus className="ml-2" />
                        </button>
                      </motion.div>
                    </>
                  )}
                  
                  {formStep === 2 && (
                    <>
                      {/* Содержимое страницы оформления */}
                      <motion.div variants={inputVariants} className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="image">
                          Фоновое изображение команды
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaImage className="text-gray-400" />
                          </div>
                          <input
                            id="image"
                            name="image"
                            type="text"
                            value={formData.image}
                            onChange={handleChange}
                            className={`w-full py-3 px-4 pl-10 rounded-lg border ${errors.image ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                            placeholder="URL изображения для фона команды"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <button
                              type="button"
                              onClick={() => pasteFromClipboard('image')}
                              className="text-primary-500 hover:text-primary-700 focus:outline-none"
                              title="Вставить из буфера обмена"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {errors.image && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <FaInfoCircle className="mr-1" />
                            {errors.image}
                          </p>
                        )}
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => insertExampleImage('image', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070')}
                            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                          >
                            Пример 1
                          </button>
                          <button
                            type="button"
                            onClick={() => insertExampleImage('image', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070')}
                            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                          >
                            Пример 2
                          </button>
                          <button
                            type="button"
                            onClick={() => insertExampleImage('image', 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070')}
                            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                          >
                            Пример 3
                          </button>
                        </div>
                        
                        {previewImage && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">Предпросмотр:</p>
                            <div className="relative w-full h-40 overflow-hidden rounded-lg border border-gray-200">
                              <Image 
                                src={previewImage}
                                alt="Предпросмотр фонового изображения"
                                fill
                                style={{ objectFit: 'cover' }}
                                className="transition-all duration-300"
                                onError={() => setPreviewImage('')}
                              />
                            </div>
                          </div>
                        )}
                      </motion.div>
                      
                      <motion.div variants={inputVariants} className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="logo">
                          Логотип команды
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaImage className="text-gray-400" />
                          </div>
                          <input
                            id="logo"
                            name="logo"
                            type="text"
                            value={formData.logo}
                            onChange={handleChange}
                            className={`w-full py-3 px-4 pl-10 rounded-lg border ${errors.logo ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                            placeholder="URL логотипа команды"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <button
                              type="button"
                              onClick={() => pasteFromClipboard('logo')}
                              className="text-primary-500 hover:text-primary-700 focus:outline-none"
                              title="Вставить из буфера обмена"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {errors.logo && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <FaInfoCircle className="mr-1" />
                            {errors.logo}
                          </p>
                        )}
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => insertExampleImage('logo', 'https://via.placeholder.com/200x200/3b82f6/ffffff?text=TL')}
                            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                          >
                            Логотип 1
                          </button>
                          <button
                            type="button"
                            onClick={() => insertExampleImage('logo', 'https://via.placeholder.com/200x200/10b981/ffffff?text=TC')}
                            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                          >
                            Логотип 2
                          </button>
                        </div>
                        
                        {previewLogo && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">Предпросмотр логотипа:</p>
                            <div className="relative w-20 h-20 overflow-hidden rounded-full border border-gray-200">
                              <Image 
                                src={previewLogo}
                                alt="Предпросмотр логотипа"
                                fill
                                style={{ objectFit: 'cover' }}
                                className="transition-all duration-300"
                                onError={() => setPreviewLogo('')}
                              />
                            </div>
                          </div>
                        )}
                      </motion.div>
                      
                      <motion.div variants={inputVariants} className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="teamColor">
                          Цвет команды
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            id="teamColor"
                            name="teamColor"
                            type="color"
                            value={formData.teamColor}
                            onChange={handleChange}
                            className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={formData.teamColor}
                              onChange={handleChange}
                              name="teamColor"
                              className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                              placeholder="#3b82f6"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2 flex-wrap">
                          {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, teamColor: color }))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-transform hover:scale-110"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </motion.div>
                      
                      <motion.div variants={inputVariants} className="flex flex-col sm:flex-row gap-4 mt-8">
                        <button
                          type="button"
                          className="btn-outline py-3 flex-1 flex items-center justify-center"
                          onClick={handlePrevStep}
                        >
                          <FaArrowLeft className="mr-2" /> Назад к основной информации
                        </button>
                        <button
                          type="submit"
                          className="btn-primary py-3 flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Создание...
                            </div>
                          ) : (
                            <>
                              Завершить создание <FaTrophy className="ml-2" />
                            </>
                          )}
                        </button>
                      </motion.div>
                    </>
                  )}
                </form>
              )}
              
              {/* Для третьего шага (успешного создания) не используем форму */}
              {formStep === 3 && (
                <motion.div
                  variants={inputVariants}
                  className="py-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <FaCheck className="text-green-500 text-4xl" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    Команда успешно создана!
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                    Ваша команда <span className="font-semibold text-primary-600">"{formData.name.trim()}"</span> готова. 
                    Теперь вы можете приглашать участников и участвовать в соревнованиях.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
                    <h4 className="font-medium text-gray-700 mb-3">Что дальше?</h4>
                    <ul className="text-left text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <FaUserPlus className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Пригласите участников в свою команду</span>
                      </li>
                      <li className="flex items-start">
                        <FaTrophy className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Примите участие в соревнованиях</span>
                      </li>
                      <li className="flex items-start">
                        <FaUsers className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Управляйте составом и активностями команды</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href={`/teams/${createdTeamId || ''}`}
                      className="btn-primary py-3 px-6 flex items-center justify-center"
                    >
                      <FaUsers className="mr-2" /> Управление командой
                    </Link>
                    <Link
                      href="/dashboard/my-teams"
                      className="btn-outline py-3 px-6 flex items-center justify-center"
                    >
                      <FaTrophy className="mr-2" /> Мои команды
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
            
            {/* Info Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 bg-gradient-to-br from-primary-50 to-accent-50 p-6 rounded-lg shadow border border-primary-100"
            >
              <h3 className="text-lg font-medium text-primary-800 mb-2">Что дальше?</h3>
              <p className="text-primary-700">
                После создания команды вы сможете приглашать участников и регистрироваться на соревнования. Как капитан команды, вы сможете управлять ее составом и активностями.
              </p>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 