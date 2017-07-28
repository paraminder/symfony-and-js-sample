<?php

namespace AppBundle\Form;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;

class CompanyUserForm extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('username', TextType::class, array(
          'label'=>'Username',
          'mapped'=> false,
          'attr' => array(
            'class'  =>  'form-control',
            'style' =>  'margin-bottom:15px',
            'placeholder'=>'Enter username'
          )))
        ->add('email', TextType::class, array(
          'label'=>'User Email',
          'mapped'=> false,
          'attr' => array(
            'class'  =>  'form-control email',
            'style' =>  'margin-bottom:15px',
            'placeholder'=>'Enter Email'
          )))
        ->add('password', PasswordType::class, array(
          'mapped'=> false,
          'attr' => array(
            'class'  =>  'form-control',
            'style' =>  'margin-bottom:15px',
            'placeholder'=>'Enter Password'
          )));
    }

    public function getName()
    {
        return 'companyUser';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\CompanyUser',
        ));
    }

}
?>