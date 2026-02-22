import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../Contexts/AppContext';

const Terms = () => {
	const { theme } = useApp();

	return (
		<div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-gray-100 via-blue-100 to-purple-100'} relative overflow-hidden`}>
			{/* Animated background */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse' />
				<div className='absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }} />
			</div>

			<div className='relative z-10 max-w-4xl mx-auto px-6 py-12'>
				{/* Header */}
				<Link to='/' className={`inline-flex items-center gap-2 mb-8 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}>
					<span>←</span> <span>Retour</span>
				</Link>

				<div className='text-center mb-12'>
					<div className='flex items-center justify-center gap-3 mb-4'>
						<span className='text-5xl'>🎬</span>
						<h1 className={`text-5xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
							Movie<span className='text-blue-400'>Pulse</span>
						</h1>
					</div>
					<h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
						Conditions d'Utilisation
					</h2>
					<p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
						Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
					</p>
				</div>

				{/* Content */}
				<div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'} backdrop-blur-xl rounded-3xl p-8 border shadow-2xl space-y-8`}>
					
					{/* Section 1 */}
					<section>
						<h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
							<span>📜</span> 1. Acceptation des Conditions
						</h3>
						<p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
							En accédant et en utilisant MoviePulse, vous acceptez d'être lié par ces conditions d'utilisation. 
							Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
						</p>
					</section>

					{/* Section 2 */}
					<section>
						<h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
							<span>👤</span> 2. Compte Utilisateur
						</h3>
						<div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
							<p className='leading-relaxed'>Pour utiliser MoviePulse, vous devez créer un compte. Vous vous engagez à :</p>
							<ul className='list-disc list-inside space-y-1 ml-4'>
								<li>Fournir des informations exactes et à jour</li>
								<li>Maintenir la sécurité de votre mot de passe</li>
								<li>Ne pas partager votre compte avec d'autres personnes</li>
								<li>Nous informer immédiatement de toute utilisation non autorisée</li>
							</ul>
						</div>
					</section>

					{/* Section 3 */}
					<section>
						<h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
							<span>🎯</span> 3. Utilisation du Service
						</h3>
						<div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
							<p className='leading-relaxed'>MoviePulse vous permet de :</p>
							<ul className='list-disc list-inside space-y-1 ml-4'>
								<li>Découvrir des films, séries et animes</li>
								<li>Consulter des informations et critiques</li>
								<li>Créer des listes de favoris</li>
								<li>Laisser des avis et notes</li>
							</ul>
							<p className='leading-relaxed mt-4'>
								Vous vous engagez à ne pas utiliser le service à des fins illégales ou non autorisées.
							</p>
						</div>
					</section>

					{/* Section 4 */}
					<section>
						<h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
							<span>⚠️</span> 4. Contenu Utilisateur
						</h3>
						<div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
							<p className='leading-relaxed'>En publiant du contenu (avis, commentaires), vous garantissez que :</p>
							<ul className='list-disc list-inside space-y-1 ml-4'>
								<li>Le contenu ne viole aucun droit d'auteur</li>
								<li>Le contenu n'est pas offensant, diffamatoire ou illégal</li>
								<li>Vous nous accordez le droit d'utiliser ce contenu</li>
							</ul>
							<p className='leading-relaxed mt-4'>
								Nous nous réservons le droit de supprimer tout contenu inapproprié sans préavis.
							</p>
						</div>
					</section>

					{/* Section 5 */}
					<section>
						<h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
							<span>🔒</span> 5. Protection des Données
						</h3>
						<p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
							Vos données personnelles sont collectées et traitées conformément à notre politique de confidentialité. 
							Nous nous engageons à protéger vos informations et à ne jamais les vendre à des tiers.
						</p>
					</section>

					{/* Section 6 */}
					<section>
						<h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
							<span>💳</span> 6. Propriété Intellectuelle
						</h3>
						<p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
							Tout le contenu présent sur MoviePulse (logos, design, textes, images) est protégé par des droits d'auteur. 
							Les données de films proviennent de TMDB et sont utilisées conformément à leurs conditions d'utilisation.
						</p>
					</section>

					{/* Section 7 */}
					<section>
						<h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
							<span>🚫</span> 7. Limitation de Responsabilité
						</h3>
						<p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
							MoviePulse est fourni "tel quel". Nous ne garantissons pas que le service sera ininterrompu ou exempt d'erreurs. 
							Nous ne sommes pas responsables des dommages directs ou indirects résultant de l'utilisation du service.
						</p>
					</section>

					{/* Section 8 */}
					<section>
						<h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
							<span>🔄</span> 8. Modifications des Conditions
						</h3>
						<p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
							Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront effectives 
							dès leur publication sur cette page. Nous vous encourageons à consulter régulièrement cette page.
						</p>
					</section>

					{/* Section 9 */}
					<section>
						<h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
							<span>📧</span> 9. Contact
						</h3>
						<p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
							Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter à :{' '}
							<a href='mailto:contact@moviepulse.com' className='text-blue-400 hover:text-blue-300 underline'>
								contact@moviepulse.com
							</a>
						</p>
					</section>

				</div>

				{/* Footer */}
				<div className='text-center mt-8'>
					<Link 
						to='/'
						className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105'>
						Retour à l'accueil
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Terms;
