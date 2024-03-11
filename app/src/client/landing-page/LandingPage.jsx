import React from 'react'
import { Link } from 'wasp/client/router'
import { useAuth } from 'wasp/client/auth'
import { useState } from 'react'
import { HiBars3 } from 'react-icons/hi2'
import { BiLogIn } from 'react-icons/bi'
import logo from '../static/logo.png'
import { Button } from '@/components/ui/button'
import DotGrid from '../components/dot-grid/dot-grid'
import DropdownUser from '../components/DropdownUser'
export const LandingPage = () => {
  const { data: user, isLoading: isUserLoading } = useAuth()
  const NavLogo = () => (
    <img className='h-8 w-8' src={logo} alt='Your SaaS App' />
  )
  return (
    <div className='bg-white dark:text-white dark:bg-boxdark-2'>
      <header className='absolute inset-x-0 top-0 z-50 dark:bg-boxdark-2'>
        <nav
          className='flex items-center justify-between p-6 lg:px-8'
          aria-label='Global'
        >
          <div className='flex items-center lg:flex-1'>
            <a
              href='/'
              className='flex items-center -m-1.5 p-1.5 text-gray-900 duration-300 ease-in-out hover:text-[#272e3f]'
            >
              <NavLogo />
              <span className='ml-2 text-sm font-semibold leading-6 dark:text-white'>
                CA Assist
              </span>
            </a>
          </div>
          <div className='flex lg:hidden'>
            <button
              type='button'
              className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-white'
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className='sr-only'>Open main menu</span>
              <HiBars3 className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>

          <div className='hidden lg:flex lg:flex-1 lg:justify-end lg:align-end'>
            {/* <!-- Dark Mode Toggler --> */}
            <div className='flex items-center gap-3 2xsm:gap-7'>
              <ul className='flex justify-center items-center gap-2 2xsm:gap-4'>
                {/* <DarkModeSwitcher /> */}
              </ul>
              {isUserLoading ? null : !user ? (
                <Link to='/login'>
                  <div className='flex justify-end items-center duration-300 ease-in-out text-gray-900 hover:text-[#272e3f] dark:text-white'>
                    Client Login <BiLogIn size='1.1rem' className='ml-1' />
                  </div>
                </Link>
              ) : (
                <DropdownUser user={user} />
              )}
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
