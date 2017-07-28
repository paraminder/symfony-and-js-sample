<?php
namespace AppBundle\Controller;

use AppBundle\Entity\CompanyUser;
use AppBundle\Entity\Company;
use AppBundle\Entity\User;
use AppBundle\Entity\Roles;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Session\Session;
use AppBundle\Form\CompanyUserForm;
use Symfony\Component\HttpFoundation\JsonResponse;

class CompanyUserController extends BaseController {
    private $session;
    public function __construct(){
      parent::__construct();
      $this->session = new Session();
    }

    /**
     * @Route("/admin/users", name="admin_users")
     */
    public function indexAction(){
      $this->isLoggedIn();
      $cid=$this->session->get('loggedCom');
      $userListing = $this->getDoctrine()
        ->getRepository('AppBundle:CompanyUser')
        ->findBy(array('company'=>$cid));
      return $this->render('admin/company/user/user_listing.html.twig', [
        'userListing' =>  $userListing
      ]);
    }

    /**
     * @Route("/admin/user/create", name="admin_user_create")
     */
    public function createAction(Request $request) {
      
      $this->isLoggedIn();
      $companyUser = new CompanyUser;
      
      //company user form
      $form=$this->createForm(CompanyUserForm::class, new CompanyUser);
      $form->add('submit', SubmitType::class, array(
          'label'  =>  'Create User',
          'attr' => array(
            'class'  =>  'btn btn-primary',
            'style' =>  'margin-bottom:15px'
          )));

      $company = $this->getDoctrine()->getRepository('AppBundle:Company')->findOneBy(array('userId'=>$this->getUser()->getId()));
      $form->handleRequest($request);

      if($form->isSubmitted() && $form->isValid()) {
          $email = $form['email']->getData();
          $username = $form['username']->getData();
          $password = $form['password']->getData();
          $now = new\DateTime('now');           
          $user=new User;
          $encoder = $this->container->get('security.password_encoder');
          $password = $encoder->encodePassword($user, $password);
          $user->setEmail($email);
          $user->setUsername($username);
          $user->setPassword($password);
		      $companyUser->setCreateDate($now);
          $companyUser->setUser($user);
          $companyUser->setCompany($company->getId());
          $roles = new Roles;
          $roles->setUser($user);
          $roles->setRole('U');
		      $em = $this->getDoctrine()->getManager();
          $em->persist($user);
          $em->persist($companyUser);
          $em->persist($roles);
          $em->flush();
          $this->addFlash('notice','User Added Successfully');
          return $this->redirectToRoute("admin_users");
      }
      return $this->render('admin/company/user/add_user.html.twig', [
          'form'  =>  $form->createView()
      ]);
    }

    /**
     * @Route("/admin/user/edit/{id}", name="admin_user_edit")
     */
    public function editAction($id, Request $request) {
       $this->isLoggedIn();
      $em = $this->getDoctrine()->getManager();
      $companyUserDetail = $em->getRepository('AppBundle:CompanyUser')->find($id);
      if(!$companyUserDetail){ throw $this->createNotFoundException('User not found');}
       $companyUser = new CompanyUser;

      $form=$this->createForm(CompanyUserForm::class, new CompanyUser);
      $form->get('email')->setData($companyUserDetail->getUser()->getEmail());
      $form->get('username')->setData($companyUserDetail->getUser()->getUsername());
      $form->add('submit', SubmitType::class, array(
          'label'  =>  'Update User',
          'attr' => array(
            'class'  =>  'btn btn-primary',
            'style' =>  'margin-bottom:15px'
          )));

      $form->handleRequest($request);

      if($form->isSubmitted() && $form->isValid()) {
          $email = $form['email']->getData();
          $username = $form['username']->getData();
          $password = $form['password']->getData();
          $user=new User;
          $encoder = $this->container->get('security.password_encoder');
          $password = $encoder->encodePassword($user, $password);
          $now = new\DateTime('now');
          $user=$companyUserDetail->getUser();
          $user->setEmail($email);
          $user->setUsername($username);
          $user->setPassword($password);
		      $companyUserDetail->setUpdateDate($now);
          $em->flush();
          $this->addFlash('notice','User Updated Successfully');
          return $this->redirectToRoute("admin_users");
      }
      return $this->render('admin/company/user/edit_user.html.twig', [
        'companyUserDetail' =>  $companyUserDetail,
        'form'  =>  $form->createView()
        ]);
    }


    /**
     * @Route("admin/user/delete/{id}", name="admin_user_delete")
     */
    public function deleteAction($id, Request $request) {
       $this->isLoggedIn();
      $em=$this->getDoctrine()->getManager();
      $CompanyUser=$em->getRepository('AppBundle:CompanyUser')->find($id);
      $em->remove($CompanyUser);
      $em->flush();
      $this->addFlash(
             'notice',
             'User Deleted Successfully'
           );
      return $this->redirectToRoute("admin_users");
    }
    
}
?>
